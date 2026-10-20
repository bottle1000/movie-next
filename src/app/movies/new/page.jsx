import MovieAdd from '@/components/movies/MovieAdd';
import { requireAdmin } from '@/lib/auth/auth';

export default async function NewMoviePage() {
    await requireAdmin();

    return (
        <main>
            <MovieAdd />
        </main>
    );
}
