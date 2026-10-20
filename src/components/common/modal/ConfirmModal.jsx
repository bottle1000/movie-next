'use client';

import styles from './ConfirmModal.module.css';

export default function ConfirmModal({ open, message, onConfirm, onCancel }) {
    console.log(onConfirm);
    console.log(onCancel);
    if (!open) return null;

    return (
        <div className={styles.backdrop}>
            <div className={styles.modal}>
                <p>{message}</p>
                <div className={styles.actions}>
                    <button className={`${styles.btn} ${styles.btnDanger}`} onClick={onConfirm}>
                        확인
                    </button>
                    <button className={`${styles.btn} ${styles.btnGhost}`} onClick={onCancel}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    );
}
