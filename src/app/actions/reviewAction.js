'use server';

import { getCurrentUser } from '@/lib/auth/auth';
import {
    createReview,
    deleteReviewByReviewId,
    findReviewOwnerByReviewId,
    validDuplicate,
} from '@/lib/repo/review/reviewsRepo';
import { revalidatePath } from 'next/cache';

export async function createReviewAction(prevState, formData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { ok: false, message: '로그인이 필요합니다.' };
        }

        console.log(formData);
        const movieId = formData.get('movieId')?.toString();
        const content = formData.get('content')?.toString();
        const rating = formData.get('rating')?.toString();

        if (!movieId || !content) {
            return { ok: false, message: '내용은 필수 입니다.' };
        }

        const exist = await validDuplicate(movieId, user.user_id);
        if (exist) {
            return { ok: false, message: '이미 이 영화에 리뷰를 작성했습니다.' };
        }

        await createReview({ movieId, userId: user.user_id, content, rating });

        if (movieId) {
            revalidatePath(`/movies/${movieId}`);
        }

        return { ok: true, message: '리뷰 등록이 완료 되었습니다.' };
    } catch (err) {
        console.error('[createReviewAction] : ', err);
        return { ok: false, message: '서버 오류가 발생했습니다.' };
    }
}

export async function deleteReviewAction(prevState, formData) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return { ok: false, message: '로그인이 필요합니다.' };
        }

        const reviewId = Number(formData.get('reviewId'));
        console.log(reviewId);
        const movieId = Number(formData.get('movieId'));
        console.log(movieId);
        if (!reviewId) return { ok: false, message: '잘못된 요청입니다.' };

        const target = await findReviewOwnerByReviewId(reviewId);
        if (!target) {
            return { ok: false, message: '이미 삭제되었거나 존재하지 않습니다.' };
        }

        const isOwner = target.user_id === user.user_id;
        const isAdmin = user.role.toUpperCase() === 'ADMIN';
        if (!isOwner && !isAdmin) return { ok: false, message: '삭제 권한이 없습니다.' };

        await deleteReviewByReviewId(reviewId);

        if (movieId) {
            revalidatePath(`/movies/${movieId}`);
        }

        return { ok: true, message: '리뷰 삭제가 완료 되었습니다.' };
    } catch (err) {
        console.error('[deleteReviewAction]', err);
        return { ok: false, message: '서버 오류' };
    }
}
