import { prisma } from '../prisma';

export async function countMovieLikes(movieId) {
    return prisma.movie_like.count({ where: { movie_id: Number(movieId) } });
}

export async function isMovieLikedByUser(userId, movieId) {
    return prisma.movie_like.findUnique({
        where: {
            movie_id_user_id: {
                movie_id: Number(movieId),
                user_id: Number(userId),
            },
        },
        select: {
            movie_id: true,
        },
    });
}

export async function createMovieLike(userId, movieId) {
    await prisma.movie_like.create({
        data: {
            user_id: Number(userId),
            movie_id: Number(movieId),
        },
    });
    return true;
}

export async function deleteMovieLike(userId, movieId) {
    await prisma.movie_like.delete({
        where: {
            movie_id_user_id: {
                movie_id: Number(movieId),
                user_id: Number(userId),
            },
        },
    });
    return true;
}
