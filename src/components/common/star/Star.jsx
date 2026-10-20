import styles from '../common.module.css';

export default function Star({ rating }) {
    const fullStar = '★';
    const emptyStar = '☆';

    const maxRating = 5;
    const stars = Array.from({ length: maxRating }, (_, i) => {
        return i + 1;
    });

    return (
        <div className={styles.star}>
            {stars.map(star => {
                return <span key={star}>{star <= rating ? fullStar : emptyStar}</span>;
            })}
        </div>
    );
}
