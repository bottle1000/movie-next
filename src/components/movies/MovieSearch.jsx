import Link from 'next/link';
import MovieGrid from './MovieGrid';
import styles from './MovieSearch.module.css';

export default function MovieSearch({ query, items }) {
    return (
        <div className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>검색 결과</h1>
                <Link href="/movies" className={styles.actionLink}>
                    전체 목록
                </Link>
            </div>
            {query && items?.length === 0 && <div className={styles.helper}>"{query}" 결과가 없습니다.</div>}
            {items.length > 0 && <MovieGrid movies={items} />}
        </div>
    );
}
