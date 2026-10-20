import LoginClient from '@/components/auth/LoginClient';
import { getCurrentUser } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function LoginPage() {
    if (await getCurrentUser()) {
        redirect('/movies');
    }
    return <LoginClient />;
}
