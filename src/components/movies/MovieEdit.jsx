'use client';

import { deleteMovieAction, updateMovieAction } from '@/app/actions/moviesActions';
import { useRouter } from 'next/navigation';
import { useActionState, useRef, useState } from 'react';
import styles from './MovieEdit.module.css';
import ConfirmModal from '../common/modal/ConfirmModal';

export default function MovieEdit({ movie }) {
    const [editState, editFormAction, editPending] = useActionState(updateMovieAction, {
        ok: false,
        message: '',
        fieldErros: {},
    });
    const editFormRef = useRef(null);
    const [editOpen, setEditOpen] = useState(false);

    const [deleteState, deleteFormAction, deletePending] = useActionState(deleteMovieAction, {
        ok: false,
    });
    const deleteFormRef = useRef(null);
    const [deleteOpen, setDeleteOpen] = useState(false);

    const [preview, setPreview] = useState(movie.thumbnail ?? '');

    function handleThumbnailChange(e) {
        const file = e.target.files?.[0];
        if (!file) {
            setPreview(movie.thumbnail ?? '');
            return;
        }

        const nextUrl = URL.createObjectURL(file);
        setPreview(nextUrl);
    }
    const router = useRouter();

    return (
        <div className={styles.wrapper}>
            <div className={styles.headerRow}>
                <h1 className={styles.title}>Edit Movie</h1>
                <button className={styles.btn} onClick={() => router.push('/movies')}>
                    목록
                </button>
            </div>

            {editState?.message && <div className={styles.helper}>{editState?.message}</div>}

            <form ref={editFormRef} action={editFormAction} className={styles.formCard}>
                <input type="hidden" name="id" value={movie.movie_id} />

                <div className={styles.field}>
                    <label className={styles.label}>Title</label>
                    <input
                        className={`${styles.input} ${editState.fieldErrors?.title ? styles.inputError : ''}`}
                        name="title"
                        defaultValue={movie.title}
                    />
                    {editState.fieldErrors?.title && <p className={styles.errorText}>{editState.fieldErrors.title}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Director</label>
                    <input
                        className={`${styles.input} ${editState.fieldErrors?.director ? styles.inputError : ''}`}
                        name="director"
                        defaultValue={movie.director}
                    />
                    {editState.fieldErrors?.director && (
                        <p className={styles.errorText}>{editState.fieldErrors.director}</p>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Year</label>
                    <input
                        className={`${styles.input} ${editState.fieldErrors?.year ? styles.inputError : ''}`}
                        name="year"
                        type="number"
                        defaultValue={movie.year ?? ''}
                    />
                    {editState.fieldErrors?.year && <p className={styles.errorText}>{editState.fieldErrors.year}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Story</label>
                    <textarea
                        className={`${styles.textarea} ${editState.fieldErrors?.story ? styles.inputError : ''}`}
                        name="story"
                        defaultValue={movie.story}
                    />
                    {editState.fieldErrors?.story && <p className={styles.errorText}>{editState.fieldErrors.story}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Thumbnail</label>
                    <img src={preview} alt={movie.tile} className={styles.editThumbnail} />
                    <input
                        className={`${styles.input} ${editState.fieldErrors?.thumbnail ? styles.inputError : ''}`}
                        type="file"
                        name="thumbnailFile"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handleThumbnailChange}
                    />
                    {editState.fieldErrors?.thumbnail && (
                        <p className={styles.errorText}>{editState.fieldErrors.thumbnail}</p>
                    )}
                </div>

                <div className={styles.toolbar}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        disabled={editPending}
                        onClick={() => setEditOpen(true)}
                    >
                        {editPending ? 'Saving...' : 'Save'}
                    </button>

                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={() => setDeleteOpen(true)}
                    >
                        Delete
                    </button>
                </div>
                {editState?.error && <p style={{ color: 'red' }}>{editState.error}</p>}
            </form>

            <ConfirmModal
                open={editOpen}
                message={`${movie.title} 영화를 수정하시겠습니까?`}
                onConfirm={() => {
                    editFormRef.current.requestSubmit();
                    setEditOpen(false);
                }}
                onCancel={() => setEditOpen(false)}
            />

            <form ref={deleteFormRef} action={deleteFormAction} className={styles.formCard}>
                <input type="hidden" name="id" value={movie.movie_id} />
            </form>

            <ConfirmModal
                open={deleteOpen}
                message="정말 이 영화를 삭제하시겠습니까?"
                onConfirm={() => {
                    deleteFormRef.current.requestSubmit();
                    setDeleteOpen(false);
                }}
                onCancel={() => setDeleteOpen(false)}
            />
        </div>
    );
}
