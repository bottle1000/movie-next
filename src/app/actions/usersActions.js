'use server';

import { getCurrentUser } from '@/lib/auth/auth';
import { findUserProfileImgByUserId, updateUserProfileImgByUserId } from '@/lib/repo/user/usersRepo';
import { mkdir, writeFile } from 'fs/promises';
import { redirect } from 'next/navigation';
import path from 'path';

async function saveLocalProfileImg(file) {
    const mime = file.type;
    const ext = mime === 'image/png' ? 'png' : mime === 'image/jpeg' ? 'jpg' : 'webp';
    const fileName = `${crypto.randomUUID()}.${ext}`;

    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profile');
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadDir, fileName), buffer);

    return `/uploads/profile/${fileName}`;
}

export async function updateProfileAction(prevState, formData) {
    try {
        const current = await getCurrentUser();
        if (!current) {
            return { ok: false, message: '로그인이 필요합니다.' };
        }

        const userId = Number(formData.get('userId'));
        console.log(userId);
        if (!userId || Number.isNaN(userId)) {
            return { ok: false, message: '잘못된 요청입니다.' };
        }

        const isOwner = Number(current.user_id) === userId;
        if (!isOwner) {
            return { ok: false, message: '프로필을 수정할 권한이 없습니다.' };
        }

        const exist = await findUserProfileImgByUserId(userId);

        if (!exist) {
            return { ok: false, message: '사용자를 찾을 수 없습니다.' };
        }

        const file = formData.get('profileFile');

        if (!file || file.size === 0) {
            return { ok: false, message: '업로드할 이미지를 선택해 주세요.' };
        }

        const newImagePath = await saveLocalProfileImg(file);

        await updateUserProfileImgByUserId(userId, newImagePath);
    } catch (err) {
        console.error('[updateProfileAction]', err);
        return { ok: false, message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' };
    }

    redirect(`/users/${Number(formData.get('userId'))}/profile`);
}
