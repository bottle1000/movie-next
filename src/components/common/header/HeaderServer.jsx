import { getCurrentUser } from '@/lib/auth/auth';
import HeaderClient from './HeaderClient';

export default async function HeaderServer() {
    const getUser = await getCurrentUser();
    const user = getUser ? { ...getUser, id: Number(getUser.id) } : null;
    return <HeaderClient user={user} />;
}
