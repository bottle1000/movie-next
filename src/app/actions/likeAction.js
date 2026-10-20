'use server';

import { getCurrentUser } from '@/lib/auth/auth';
import { countMovieLikes, createMovieLike, deleteMovieLike, isMovieLikedByUser } from '@/lib/repo/like/likeRepo';

export async function toggleMovieLike(prevState, formData) {
    const movieId = Number(formData.get('movieId'));
    const user = await getCurrentUser();
    if (!user) {
        return { ok: false, message: '로그인이 필요합니다.' };
    }

    //1. 좋아요 안 눌렀을 때 -> 2. null 반환
    const liked = await isMovieLikedByUser(user.user_id, movieId);
    console.log(liked);

    if (liked) {
        await deleteMovieLike(user.user_id, movieId);
    } else {
        await createMovieLike(user.user_id, movieId);
    }

    const count = await countMovieLikes(movieId);

    return { ok: true, liked: !liked, count };
}
