// (서버 컴포넌트) 컨트롤러 역할만: 로그인돼 있으면 리다이렉트, 아니면 클라 컴포만 내려줌
import { getCurrentUser } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';
import RegisterClient from '@/components/auth/RegisterClient';

export const runtime = 'nodejs';

export default async function RegisterPage() {
    if (await getCurrentUser()) {
        redirect('/movies');
    }
    return <RegisterClient />;
}
