'use client';

import Link from 'next/link';
import styles from '../common.module.css';
import { useActionState } from 'react';
import { logout } from '@/app/actions/authActions';

export default function HeaderClient({ user }) {
    const [_, logoutAction, logoutPending] = useActionState(logout, { ok: true });

    return (
        <header className={styles.header}>
            <div className={styles.headerInner}>
                <div className={styles.brand}>
                    <Link className={styles.active} href="/movies">
                        Home
                    </Link>
                </div>

                <nav className={styles.navRight}>
                    {user ? (
                        <>
                            <img
                                src={user.profile_image ?? '/default-profile.png'}
                                alt="profile"
                                className={styles.profile_image}
                            />
                            <Link href={`/users/${user.user_id}`} className={styles.navText}>
                                {user.name}님
                            </Link>
                            <form action={logoutAction}>
                                <button
                                    type="submit"
                                    disabled={logoutPending}
                                    className={`${styles.btn} ${styles.btnGhost} ${styles.btnLogout}`}
                                >
                                    {logoutPending ? '로그아웃 중..' : '로그아웃'}
                                </button>
                            </form>
                        </>
                    ) : (
                        <>
                            <Link className={`${styles.btn} ${styles.btnGhost}`} href={`/auth/login`}>
                                Login
                            </Link>
                            <Link className={`${styles.btn} ${styles.btnPrimary}`} href={`/auth/register`}>
                                Sign up
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
