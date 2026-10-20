import './globals.css';
import Footer from '../components/common/footer/Footer';
import HeaderServer from '../components/common/header/HeaderServer';

export default function RootLayout({ children }) {
    return (
        <html lang="ko">
            <body>
                <HeaderServer />
                <main>{children}</main>
                <Footer />
            </body>
        </html>
    );
}
