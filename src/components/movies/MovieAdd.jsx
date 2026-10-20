'use client';

import { createMovieAction } from '@/app/actions/moviesActions';
import { useRouter } from 'next/navigation';
import { useActionState, useRef, useState } from 'react';
import styles from './MovieAdd.module.css';
import AlertModal from '../common/modal/ConfirmModal';

export default function MovieAdd() {
    const [addState, addAction, isPending] = useActionState(createMovieAction, {
        ok: false,
        message: '',
        fieldErrors: {},
        fields: { title: '', director: '', story: '', year: '' },
    });

    const formRef = useRef(null);
    const router = useRouter();

    const [preview, setPreview] = useState(null);

    const [open, setOpen] = useState(false);

    function handlePreviewThumbnailChange(e) {
        const file = e.target.files?.[0];
        const nextUrl = URL.createObjectURL(file);
        setPreview(nextUrl);
    }

    return (
        <div className={styles.wrapper}>
            <AlertModal
                open={open}
                message="이 영화 정보를 추가하시겠습니까?"
                onConfirm={() => {
                    formRef.current.requestSubmit();
                    setOpen(false);
                }}
                onCancel={() => setOpen(false)}
            />
            <div className={styles.headerRow}>
                <h1 className={styles.title}>Add Movie</h1>
                <button className={styles.btn} onClick={() => router.push('/movies')}>
                    목록
                </button>
            </div>

            {addState?.message && <div className={styles.helper}>{addState.message}</div>}

            <form ref={formRef} action={addAction} className={styles.formCard}>
                <div className={styles.field}>
                    <label className={styles.label}>Title</label>
                    <input
                        className={`${styles.input} ${addState.fieldErrors?.title ? styles.inputError : ''}`}
                        defaultValue={addState.fields?.title}
                        name="title"
                        placeholder="예) 기생충"
                    />
                    {addState.fieldErrors?.title && <p className={styles.errorText}>{addState.fieldErrors.title}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Director</label>
                    <input
                        className={`${styles.input} ${addState.fieldErrors?.director ? styles.inputError : ''}`}
                        defaultValue={addState.fields?.director}
                        name="director"
                        placeholder="예) 봉준호"
                    />
                    {addState.fieldErrors?.director && (
                        <p className={styles.errorText}>{addState.fieldErrors.director}</p>
                    )}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Year</label>
                    <input
                        className={`${styles.input} ${addState.fieldErrors?.year ? styles.inputError : ''}`}
                        defaultValue={addState.fields?.year}
                        name="year"
                        type="number"
                        placeholder="예) 2019"
                    />
                    {addState.fieldErrors?.year && <p className={styles.errorText}>{addState.fieldErrors.year}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Story</label>
                    <textarea
                        className={`${styles.textarea} ${addState.fieldErrors?.story ? styles.inputError : ''}`}
                        defaultValue={addState.fields?.story}
                        name="story"
                        placeholder="간단한 줄거리"
                    />
                    {addState.fieldErrors?.story && <p className={styles.errorText}>{addState.fieldErrors.story}</p>}
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Thumbnail</label>
                    <img src={preview} className={styles.addThumbnail} />
                    <input
                        className={`${styles.input} ${addState.fieldErrors?.thumbnail ? styles.inputError : ''}`}
                        type="file"
                        name="thumbnailFile"
                        accept="image/png, image/jpeg, image/webp"
                        onChange={handlePreviewThumbnailChange}
                    />
                    {addState.fieldErrors?.thumbnail && (
                        <p className={styles.errorText}>{addState.fieldErrors.thumbnail}</p>
                    )}
                </div>

                <div className={styles.toolbar}>
                    <button
                        type="button"
                        className={`${styles.btn} ${styles.btnPrimary}`}
                        onClick={() => setOpen(true)}
                        disabled={isPending}
                    >
                        저장
                    </button>
                    <button type="button" className={styles.btn} onClick={() => router.push('/movies')}>
                        취소
                    </button>
                </div>
            </form>
        </div>
    );
}
