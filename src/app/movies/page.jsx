import MovieList from '@/components/movies/MovieList';
import { getCurrentUser } from '@/lib/auth/auth';
import { findAllMovies } from '@/lib/repo/movie/movieRepo';

export default async function MoviesPage() {
    const movies = await findAllMovies();
    const getUser = await getCurrentUser();
    const isAdmin = getUser?.role?.toUpperCase?.() === 'ADMIN';
    return (
        <main>
            <MovieList movies={movies} isAdmin={isAdmin} />
        </main>
    );
}
