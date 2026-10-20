'use client';

import { updateProfileAction } from '@/app/actions/usersActions';
import { useActionState } from 'react';
import styles from './ProfileForm.module.css';

export default function ProfileForm({ user }) {
    const [state, formAction, pending] = useActionState(updateProfileAction, {
        ok: true,
        message: '',
    });

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>프로필 사진</h2>

            <div className={styles.current}>
                <span className={styles.label}>현재 이미지</span>
                <img
                    src={user.profile_image ? user.profile_image : `/default-profile.png`}
                    alt={user.name}
                    className={styles.avatar}
                />
            </div>

            <form action={formAction} className={styles.form}>
                <input type="hidden" name="userId" value={user.user_id} />

                <div className={styles.field}>
                    <label className={styles.label}>새 프로필 이미지 (선택)</label>
                    <input
                        type="file"
                        name="profileFile"
                        accept="image/png, image/jpeg, image/webp"
                        className={styles.input}
                    />
                </div>

                {!state.ok && state.message && <p className={styles.error}>{state.message}</p>}

                <button type="submit" disabled={pending} className={`${styles.btn} ${styles.btnPrimary}`}>
                    {pending ? '저장 중...' : '저장'}
                </button>
            </form>
        </div>
    );
}
