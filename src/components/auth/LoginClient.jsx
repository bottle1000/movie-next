'use client';

import { useActionState } from 'react';
import { login } from '@/app/actions/authActions';
import styles from './auth.module.css';
import Link from 'next/link';

export default function LoginClient() {
    const [loginState, loginAction, loginPending] = useActionState(login, {
        ok: true,
        message: '',
        field: { email: '' },
    });

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>로그인</h2>

            <form action={loginAction}>
                <div className={styles.field}>
                    <label className={styles.label}>이메일</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="이메일 입력"
                        defaultValue={loginState.field?.email}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>비밀번호</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="8자 이상, 대/소문자, 숫자, 특수문자 1개 이상 포함해주세요."
                        className={styles.input}
                    />
                </div>

                {loginState?.ok === false && <div className={styles.error}>{loginState.message}</div>}

                <button type="submit" disabled={loginPending} className={`${styles.btn} ${styles.btnPrimary}`}>
                    <span className={styles.btnLabel}>{loginPending ? '로그인 중' : '로그인'}</span>
                </button>
            </form>

            <div className={styles.row}>
                <Link href="/auth/register" className={styles.hint}>
                    계정이 없나요?
                </Link>
            </div>
        </div>
    );
}
