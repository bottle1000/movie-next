import MovieDetail from '@/components/movies/MovieDetail';
import ReviewFormClient from '@/components/review/ReviewFormClient';
import { getCurrentUser } from '@/lib/auth/auth';
import { countMovieLikes, isMovieLikedByUser } from '@/lib/repo/like/likeRepo';
import { findMovieById } from '@/lib/repo/movie/movieRepo';
import { findReviewsByMovieId, getAverageRatingByMovieId } from '@/lib/repo/review/reviewsRepo';
import { notFound } from 'next/navigation';

export default async function MovieDetailPage({ params }) {
    const param = await params;
    const id = Number(param.id);

    const movie = await findMovieById(id);
    if (!movie) {
        return notFound();
    }
    const reviews = await findReviewsByMovieId(id);

    const user = await getCurrentUser();
    const userId = user?.user_id ?? null;
    const isAdmin = user?.role?.toUpperCase?.() === 'ADMIN';

    const initialCount = await countMovieLikes(movie.movie_id);
    const initialLiked = user ? await isMovieLikedByUser(user.user_id, movie.movie_id) : false;

    const avgRating = await getAverageRatingByMovieId(movie.movie_id);
    console.log(avgRating);

    return (
        <div>
            <MovieDetail
                movie={movie}
                isAdmin={isAdmin}
                initialCount={initialCount}
                initialLiked={initialLiked}
                avgRating={avgRating}
            />
            <ReviewFormClient reviews={reviews} movieId={id} currentUserId={userId} isAdmin={isAdmin} />
        </div>
    );
}
