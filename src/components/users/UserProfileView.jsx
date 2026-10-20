'use client';

import Link from 'next/link';
import styles from './UserProfileView.module.css';

export default function UserProfileView({ user }) {
    return (
        <main className={styles.page}>
            <section className={styles.profileCard}>
                <div className={styles.avatarWrap}>
                    <img src={user.profile_image ?? '/default-profile.png'} alt={user.name} className={styles.avatar} />
                </div>

                <div className={styles.info}>
                    <h1 className={styles.name}>{user.name}</h1>
                    <p className={styles.email}>{user.email}</p>

                    {user.birth_date && (
                        <p className={styles.meta}>
                            생년월일 : {new Date(user.birth_date).toLocaleDateString('ko-KR')}
                        </p>
                    )}

                    {user.created_at && (
                        <p className={styles.meta}>가입일 : {new Date(user.created_at).toLocaleDateString('ko-KR')}</p>
                    )}

                    <div className={styles.actions}>
                        <Link href={`/users/${user.user_id}/profile`} className={styles.btnPrimary}>
                            프로필 사진 변경
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
