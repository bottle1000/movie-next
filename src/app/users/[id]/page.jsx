import UserProfileView from '@/components/users/UserProfileView';
import { getCurrentUser } from '@/lib/auth/auth';
import { findUserById } from '@/lib/repo/user/usersRepo';
import { redirect } from 'next/dist/server/api-utils';
import { notFound } from 'next/navigation';

export default async function UserProfileViewPage({ params }) {
    const { id } = await params;
    const userId = Number(id);

    console.log(userId);

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect('/auth/login');
    }

    console.log(currentUser.user_id === userId);

    if (currentUser.user_id === userId) {
        redirect('/movies');
    }

    const user = await findUserById(userId);
    console.log(user);
    if (!user) {
        return notFound();
    }

    return (
        <main>
            <UserProfileView user={user} />
        </main>
    );
}
