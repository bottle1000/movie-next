'use server';

import { createSession, destroySession } from '@/lib/auth/auth';
import { hashPassword, verifyPassword } from '@/lib/auth/crypto';
import { prisma } from '@/lib/repo/prisma';
import { findUserByEmail } from '@/lib/repo/user/usersRepo';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const PWD_REGEX = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?/`]).{8,64}$/;

export async function register(prevState, formData) {
    try {
        const email = (formData.get('email') || '').toString();
        const name = (formData.get('name') || '').toString();
        const birth = (formData.get('birth_date') || '').toString();
        const password = (formData.get('password') || '').toString();
        const confirmPassword = (formData.get('confirmPassword') || '').toString();

        if (!email || !name || !birth || !password || !confirmPassword) {
            return {
                ok: false,
                message: '이메일/이름/생년월일/비밀번호는 필수입니다.',
                fields: { email, name, birth },
            };
        }

        // DATE 컬럼에는 입력한 달력 날짜를 UTC 자정으로 변환해 저장한다.
        const birthDate = new Date(`${birth}T00:00:00.000Z`);
        if (
            !/^\d{4}-\d{2}-\d{2}$/.test(birth) ||
            Number.isNaN(birthDate.getTime()) ||
            birthDate.toISOString().slice(0, 10) !== birth
        ) {
            return {
                ok: false,
                message: '올바른 생년월일을 입력해 주세요.',
                fields: { email, name, birth },
            };
        }

        if (!PWD_REGEX.test(password)) {
            return {
                ok: false,
                message: '비밀번호는 공백 없이 8~64자이며 대/소문자, 숫자, 특수문자를 각각 1개 이상 포함해야 합니다.',
                fields: { email, name, birth },
            };
        }

        if (password !== confirmPassword) {
            return {
                ok: false,
                message: '비밀번호가 일치하지 않습니다.',
                fields: { email, name, birth },
            };
        }

        const exist = await prisma.users.findUnique({ where: { email } });
        if (exist) {
            return { ok: false, message: '이미 가입된 이메일입니다.', fileds: { name, birth } };
        }

        const passwordHash = await hashPassword(password);

        // DB 저장
        const user = await prisma.users.create({
            data: { email, name: name, birth_date: birthDate, role: 'BASIC', password: passwordHash },
            select: { user_id: true, email: true, name: true, role: true },
        });

        await createSession(user.user_id);
    } catch (e) {
        console.error('registerAction error', e);
        return { ok: false, message: '서버 오류 발생' };
    }

    redirect('/movies');
}

export async function login(prevState, formData) {
    try {
        const email = (formData.get('email') || '').toString();
        const password = (formData.get('password') || '').toString();

        if (!email || !password) {
            return { ok: false, message: '이메일/비밀번호를 입력하세요.', field: { email } };
        }

        const user = await findUserByEmail(email);
        if (!user) {
            return { ok: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.' };
        }

        if (!(await verifyPassword(password, user.password))) {
            return { ok: false, message: '이메일 또는 비밀번호가 일치하지 않습니다.', field: { email } };
        }

        await createSession(user.user_id);

        revalidatePath('/movies');
        return { ok: true, message: '로그인 성공!' };
    } catch (e) {
        console.error('서버 에러', e);
        return { ok: false, message: '서버 오류가 발생했습니다.' };
    }
}

export async function logout() {
    try {
        await destroySession();
    } catch (e) {
        console.error('logoutAction error', e);
    }
    redirect('/movies');
}
