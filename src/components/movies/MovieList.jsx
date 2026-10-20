'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import styles from './MovieList.module.css';
import MovieGrid from './MovieGrid';
import { searchMoviesAction } from '@/app/actions/moviesActions';

export default function MovieList({ movies, isAdmin }) {
    const [state, formAction, pending] = useActionState(searchMoviesAction, { ok: true, message: '' });
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>Movies</h1>
                {isAdmin && (
                    <Link href="/movies/new" className={`${styles.actionLink} ${styles.btnPrimary}`}>
                        새 영화 추가
                    </Link>
                )}
            </div>

            <form action={formAction} className={styles.searchBox}>
                <input name="query" className={styles.searchInput} placeholder="제목으로 검색" minLength={2} required />
                <button className={styles.searchButton} type="submit" disabled={pending}>
                    {pending ? '이동 중...' : '검색'}
                </button>
            </form>

            {state?.message && <div className={styles.helper}>{state.message}</div>}

            {/* 기본 목록 그리드 */}
            <MovieGrid movies={movies} />
        </div>
    );
}
