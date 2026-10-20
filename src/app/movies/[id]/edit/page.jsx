import { findMovieById } from '@/lib/repo/movie/movieRepo';
import MovieEdit from '@/components/movies/MovieEdit';
import { requireAdmin } from '@/lib/auth/auth';
import { notFound } from 'next/navigation';

export default async function EditMoviePage({ params }) {
    await requireAdmin();

    const param = await params;
    const id = Number(param.id);

    const movie = await findMovieById(id);
    if (!movie) {
        notFound();
    }
    return (
        <main>
            <MovieEdit movie={movie} />
        </main>
    );
}
