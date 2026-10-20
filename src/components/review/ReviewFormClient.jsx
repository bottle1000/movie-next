'use client';

import { createReviewAction, deleteReviewAction } from '@/app/actions/reviewAction';
import { useActionState, useRef, useState } from 'react';
import styles from './ReviewForm.module.css';
import Star from '../common/star/Star';
import ConfirmModal from '../common/modal/ConfirmModal';

export default function ReviewFormClient({ reviews, movieId, currentUserId, isAdmin }) {
    const [createState, createFormAction, createPending] = useActionState(createReviewAction, {
        ok: true,
        message: '',
    });
    const [deleteState, deleteFormAction, deletePending] = useActionState(deleteReviewAction, {
        ok: true,
        message: '',
    });

    const deleteFormRef = useRef(null);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [targetReviewId, setTargetReviewId] = useState('');

    const createFormRef = useRef(null);
    const [createOpen, setCreateOpen] = useState(false);

    const sortedReviews = [...reviews].sort((a, b) => {
        const aMine = a.user_id === currentUserId; // a리뷰를 쓴 유저가 지금 로그인한 유저와 같냐?
        const bMine = b.user_id === currentUserId; // b리뷰를 쓴 유저가 지금 로그인한 유저와 같냐? => 근데 정책상 1인 1리뷰이기 때문에

        if (aMine === bMine) return 0;

        return aMine ? -1 : 1;
    });

    return (
        <>
            <div className={styles.reviewHeader}>
                <span style={{ fontSize: '20px' }}>리뷰 목록</span>
            </div>
            <ul className={styles.list}>
                {sortedReviews.length > 0 ? (
                    sortedReviews.map(review => {
                        const canDelete = isAdmin || review.user_id === currentUserId;
                        const isMine = review.user_id === currentUserId;
                        return (
                            <li key={review.review_id} className={`${styles.item} ${isMine ? styles.myReview : ''}`}>
                                <div className={styles.row}>
                                    <strong className={styles.author}>{review.users?.name}</strong>
                                    <Star rating={review.rating}></Star>
                                    <span className={styles.content}>{review.content}</span>
                                    <span className={styles.date}>{new Date(review.created_at).toLocaleString()}</span>
                                    <span>
                                        {canDelete && (
                                            <button
                                                type="button"
                                                className={`btn ${styles.submitBtn} ${
                                                    deletePending ? styles.btnDisabled : 'btnPrimary'
                                                }`}
                                                onClick={() => {
                                                    setTargetReviewId(review.review_id);
                                                    setDeleteOpen(true);
                                                }}
                                            >
                                                {deletePending ? '삭제 중…' : '삭제'}
                                            </button>
                                        )}
                                    </span>
                                </div>
                            </li>
                        );
                    })
                ) : (
                    <li className={styles.empty}>등록된 리뷰가 없습니다.</li>
                )}
            </ul>

            <form ref={createFormRef} action={createFormAction} className={styles.form}>
                <input type="hidden" name="movieId" value={movieId} />

                <div className={styles.row}>
                    <select name="rating" defaultValue="0" className={styles.select}>
                        <option value="0">평점 선택</option>
                        <option value="1">★</option>
                        <option value="2">★★</option>
                        <option value="3">★★★</option>
                        <option value="4">★★★★</option>
                        <option value="5">★★★★★</option>
                    </select>

                    <input name="content" placeholder="감상평을 입력하세요" className={styles.input} />

                    <button
                        type="button"
                        disabled={createPending}
                        className={`btn ${styles.submitBtn} ${createPending ? styles.btnDisabled : 'btnPrimary'}`}
                        onClick={() => {
                            console.log('[create-click]');
                            setCreateOpen(true);
                        }}
                    >
                        {createPending ? '등록 중...' : '등록'}
                    </button>
                </div>
                {!createState.ok && createState.message && <p className={styles.error}>{createState.message}</p>}
            </form>

            <ConfirmModal
                open={createOpen}
                message="리뷰를 추가하시겠습니까?"
                onConfirm={() => {
                    console.log('[create-confirm]');
                    createFormRef.current.requestSubmit();
                    setCreateOpen(false);
                }}
                onCancel={() => setCreateOpen(false)}
            />

            <form ref={deleteFormRef} action={deleteFormAction} className={styles.inlineForm}>
                <input type="hidden" name="reviewId" value={targetReviewId} />
                <input type="hidden" name="movieId" value={movieId} />
            </form>

            <ConfirmModal
                open={deleteOpen}
                message="정말 이 리뷰를 삭제하시겠습니까?"
                onConfirm={() => {
                    deleteFormRef.current.requestSubmit();
                    setDeleteOpen(false);
                }}
                onCancel={() => setDeleteOpen(false)}
            />
        </>
    );
}
