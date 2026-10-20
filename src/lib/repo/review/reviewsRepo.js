import { prisma } from '../prisma';

export async function findReviewsByMovieId(movieId) {
    return prisma.review.findMany({
        where: { movie_id: Number(movieId) },
        select: {
            review_id: true,
            rating: true,
            content: true,
            user_id: true,
            created_at: true,
            users: { select: { name: true } },
        },
        orderBy: { review_id: 'desc' },
    });
}

export async function findReviewOwnerByReviewId(reviewId) {
    return prisma.review.findUnique({
        where: { review_id: Number(reviewId) },
        select: { review_id: true, user_id: true, movie_id: true },
    });
}

export async function findRatingByMovieIdAndUserId(movieId, userId) {
    return prisma.review.findFirst({
        where: { movie_id: Number(movieId), user_id: Number(userId) },
        select: { rating: true },
    });
}

export async function validDuplicate(movieId, userId) {
    return prisma.review.findFirst({
        where: { movie_id: Number(movieId), user_id: Number(userId) },
        select: { review_id: true },
    });
}

export async function createReview({ movieId, userId, content, rating }) {
    await prisma.review.create({
        data: {
            movie_id: Number(movieId),
            user_id: Number(userId),
            content,
            rating: rating ? Number(rating) : 0,
        },
    });
}

export async function deleteReviewByReviewId(id) {
    await prisma.review.delete({
        where: { review_id: Number(id) },
    });
}

export async function getAverageRatingByMovieId(movieId) {
    const result = await prisma.review.aggregate({
        _avg: {
            rating: true,
        },
        where: {
            movie_id: Number(movieId),
        },
    });

    return result._avg.rating ?? 0;
}
