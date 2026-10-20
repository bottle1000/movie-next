'use client';

import { useActionState, useState } from 'react';
import { register } from '@/app/actions/authActions';
import styles from './auth.module.css';
import Link from 'next/link';

const PWD_REGEX = /^(?!.*\s)(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[~!@#$%^&*()_\-+={}\[\]|\\:;"'<>,.?/`]).{8,64}$/;

export default function RegisterClient() {
    const [registerState, registerAction, registerPending] = useActionState(register, {
        ok: true,
        message: '',
        fields: { email: '', name: '', birth: '' },
    });

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [valid, setValid] = useState(null);

    const hasBoth = password !== '' && confirmPassword !== '';
    const isMatch = hasBoth && password === confirmPassword;

    function handlePasswordChange(e) {
        setPassword(e.target.value);
        setValid(PWD_REGEX.test(e.target.value));
    }

    function handleConfirmChange(e) {
        setConfirmPassword(e.target.value);
    }

    return (
        <div className={styles.card}>
            <h2 className={styles.title}>회원가입</h2>

            <form action={registerAction}>
                <div className={styles.field}>
                    <label className={styles.label}>이메일</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        defaultValue={registerState.fields?.email}
                        placeholder="이메일 입력"
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="name" className={styles.label}>
                        이름
                    </label>
                    <input
                        id="name"
                        name="name"
                        placeholder="이름 입력"
                        defaultValue={registerState.fields?.name}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="birth_date" className={styles.label}>
                        생년 월일
                    </label>
                    <input
                        id="birth_date"
                        name="birth_date"
                        type="date"
                        defaultValue={registerState.fields?.birth}
                        required
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label htmlFor="password" className={styles.label}>
                        비밀번호
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        placeholder="8자 이상, 대/소문자, 숫자, 특수문자 1개 이상 포함해주세요."
                        className={`${styles.input} ${
                            // 비밀번호에 값이 없을 때(즉, null일 때)는 스타일을 적용 X
                            valid === false ? styles.inputError : valid === true ? styles.inputOk : ''
                        }`}
                        onChange={handlePasswordChange}
                    />

                    {password !== '' && valid === false && (
                        <p className={styles.errorText}>비밀번호가 유효하지 않습니다.</p>
                    )}
                    {password !== '' && valid === true && <p className={styles.okText}>사용 가능한 비밀번호입니다.</p>}
                </div>

                <div className={styles.field}>
                    <label htmlFor="confirmPassword" className={styles.label}>
                        비밀번호 재확인
                    </label>
                    <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        required
                        placeholder="비밀번호 입력"
                        className={styles.input}
                        onChange={handleConfirmChange}
                    />
                    {hasBoth && (
                        <p className={isMatch ? styles.okText : styles.errorText}>
                            {isMatch ? '비밀번호가 일치합니다.' : '비밀번호가 일치하지 않습니다.'}
                        </p>
                    )}
                </div>

                {registerState?.ok === false && registerState?.message && (
                    <div className={styles.error}>{registerState.message}</div>
                )}

                <button type="submit" disabled={registerPending} className={`${styles.btn} ${styles.btnPrimary}`}>
                    <span className={styles.btnLabel}>{registerPending ? '가입 중' : '가입하기'}</span>
                </button>
            </form>

            <div className={styles.row}>
                <Link href="/auth/login" className={styles.hint}>
                    이미 계정이 있나요?
                </Link>
            </div>
        </div>
    );
}
