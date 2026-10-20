import ProfileForm from '@/components/users/ProfileForm';
import { getCurrentUser } from '@/lib/auth/auth';
import { redirect } from 'next/navigation';

export default async function userProfileEditPage({ params }) {
    const param = await params;
    const userId = Number(param.id);

    const currentUser = await getCurrentUser();
    if (!currentUser) {
        redirect('/auth/login');
    }

    const isOwner = Number(currentUser.user_id) === userId;
    console.log(isOwner);

    if (!isOwner) {
        redirect('/movies');
    }

    return (
        <>
            <h1>프로필 설정</h1>
            <ProfileForm user={currentUser}></ProfileForm>
        </>
    );
}
