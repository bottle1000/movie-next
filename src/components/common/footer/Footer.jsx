'use client';

import styles from '../common.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.footerInner}>
                <div className={styles.footerLeft}>
                    <div className={styles.footerBrand}>
                        <span className={styles.brandDot} />
                    </div>
                    <div className={styles.footerCopy}>@ {new Date().getFullYear()} All Rights Reserved.</div>
                </div>
            </div>
        </footer>
    );
}
