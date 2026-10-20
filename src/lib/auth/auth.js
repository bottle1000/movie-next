import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '../repo/prisma';
import crypto from 'node:crypto';

const COOKIE_NAME = 'sid';
// 테스트 상 시간을 30분 -> 1분으로 바꿈
const INACTIVITY_TIMEOUT_MINUTES = 1;
const INACTIVITY_TIMEOUT_MS = INACTIVITY_TIMEOUT_MINUTES * 60 * 1000;

function cookieOptions(maxAgeSec) {
    return {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: maxAgeSec,
    };
}

export async function createSession(userId, days = 7) {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

    const sidId = crypto.randomUUID();

    const headerList = headers();
    const userAgent = (await headerList).get('user-agent') ?? null;

    const session = await prisma.session.create({
        data: {
            session_id: sidId,
            user_id: userId,
            expires_at: expiresAt,
            created_at: now,
            last_accessed: now,
            user_agent: userAgent,
        },
        select: { session_id: true, expires_at: true },
    });

    const store = await cookies();
    const opts = cookieOptions(Math.floor((expiresAt - now) / 1000));
    store.set(COOKIE_NAME, sidId, opts);

    return session?.session_id ?? null;
}

export async function getCurrentUser() {
    const store = await cookies();
    const sidId = store.get(COOKIE_NAME)?.value;
    if (!sidId) return null;

    const now = new Date();

    const session = await prisma.session.findFirst({
        where: { session_id: sidId, expires_at: { gt: now } },
        include: { users: true },
    });

    if (!session) {
        return null;
    }

    const lastAccessed = session.last_accessed ? new Date(session.last_accessed) : null;
    const expiresAt = new Date(session.expires_at);

    if (now > expiresAt) {
        await prisma.session.delete({ where: { session_id: sidId } });
        console.log('유효기간 끝');
        return null;
    }

    if (lastAccessed && now.getTime() - lastAccessed.getTime() > INACTIVITY_TIMEOUT_MS) {
        await prisma.session.delete({ where: { session_id: sidId } });
        console.log('1분 지나서 자동 로그인');
        return null;
    }

    console.log(now.getTime() - lastAccessed.getTime());
    console.log(INACTIVITY_TIMEOUT_MS);

    const headerList = headers();
    const currentUa = (await headerList).get('user-agent') ?? null;

    if (session.user_agent !== currentUa) {
        console.warn('UA mismatch');

        return null;
    }

    const updates = { last_accessed: now };

    await prisma.session.update({
        where: { session_id: sidId },
        data: updates,
    });

    return session?.users;
}

export async function requireAdmin() {
    const user = await getCurrentUser();
    const grade = user?.role ? String(user.role).toUpperCase() : null;

    if (!user || grade !== 'ADMIN') {
        redirect('/movies');
    }

    return user ?? null;
}

export async function destroySession() {
    const store = await cookies();
    const sidId = store.get(COOKIE_NAME)?.value;
    if (sidId) {
        try {
            await prisma.session.delete({ where: { session_id: sidId } });
        } catch (err) {
            console.error('[destroySession] : ' + err);
        }
        store.set(COOKIE_NAME, '', { path: '/', maxAge: 0 });
    }
}
