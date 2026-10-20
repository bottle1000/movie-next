'use client';

import Link from 'next/link';
import styles from './MovieDetail.module.css';
import { toggleMovieLike } from '@/app/actions/likeAction';
import { useActionState } from 'react';

export default function MovieDetail({ movie, isAdmin, initialCount, initialLiked, avgRating }) {
    const [state, formAction, pending] = useActionState(toggleMovieLike, {
        ok: true,
        count: initialCount,
        liked: initialLiked,
    });

    return (
        <div className={styles.detailWrap}>
            <div className={styles.leftCol}>
                <img className={styles.detailPoster} src={movie.thumbnail} alt={movie.title} />
                <div className={styles.mediaMeta}>
                    <div className={styles.metaItem}>
                        <span className={styles.starSymbol}>⭐️</span>
                        <span> {avgRating}</span>
                    </div>
                    <form action={formAction} className={`${styles.metaItem} ${styles.likeForm}`}>
                        <input type="hidden" name="movieId" value={movie.movie_id} />
                        <button type="submit" disabled={pending} className={` ${styles.likeBtn}`}>
                            {state.liked ? '♥' : '♡'}
                            <span className={styles.likeCount}>{state.count}</span>
                        </button>
                    </form>
                </div>
                {!state.ok && state.message && <p className={styles.error}>{state.message}</p>}
            </div>

            <section className={styles.rightCol}>
                <div className={styles.titleRow}>
                    <h1 className={styles.detailTitle}>{movie.title}</h1>
                    {isAdmin && (
                        <Link href={`/movies/${movie.movie_id}/edit`} className={`${styles.btn} ${styles.btnGhost}`}>
                            Edit
                        </Link>
                    )}
                </div>

                <div className={styles.detailSub}>
                    {movie.director} · {movie.year}
                </div>

                <div className={styles.detailStory}>{movie.story}</div>
            </section>
        </div>
    );
}
