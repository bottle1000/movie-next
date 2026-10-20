import Link from 'next/link';
import styles from './MovieGrid.module.css';

export default function MovieGrid({ movies }) {
    return (
        <div className={styles.grid}>
            {movies.map(movie => {
                return (
                    <div key={movie.movie_id} className={styles.card}>
                        <div className={styles.thumbWrap}>
                            <img className={styles.thumb} src={movie.thumbnail} alt={movie.title} />
                        </div>
                        <div className={styles.cardBody}>
                            <Link href={`/movies/${movie.movie_id}`} prefetch={false} className={styles.movieTitle}>
                                {movie.title}
                            </Link>
                            <div className={styles.meta}>
                                {movie.director}
                                {` * ${movie.year}`}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
