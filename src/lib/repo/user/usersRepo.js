import { prisma } from '../prisma';

export async function findUserByEmail(email) {
    return prisma.users.findUnique({
        where: { email: email },
    });
}

export async function findUserById(userId) {
    return prisma.users.findUnique({
        where: { user_id: userId },
        select: {
            user_id: true,
            email: true,
            name: true,
            birth_date: true,
            profile_image: true,
            created_at: true,
        },
    });
}

export async function findUserProfileImgByUserId(userId) {
    return prisma.users.findFirst({
        where: { user_id: Number(userId) },
        select: { profile_image: true },
    });
}

export async function updateUserProfileImgByUserId(userId, newImagePath) {
    return prisma.users.update({
        where: { user_id: Number(userId) },
        data: { profile_image: newImagePath },
    });
}
