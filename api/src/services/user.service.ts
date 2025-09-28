import prisma from '../prisma';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError';

export const getUserProfile = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true } // Only return non-sensitive info
    });

    if (!user) {
        throw new ApiError('User not found.', 404);
    }
    return user;
};

export const updateUserProfile = async (userId: string, newName: string) => {
    if (!newName) {
        throw new ApiError('Name cannot be empty.', 400);
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name: newName },
        select: { id: true, name: true, email: true }
    });

    return updatedUser;
};

export const updateUserPassword = async (userId: string, currentPassword: string, newPassword: string) => {
    if (!currentPassword || !newPassword) {
        throw new ApiError('Current and new passwords are required.', 400);
    }

    if (newPassword.length < 8) {
        throw new ApiError('New password must be at least 8 characters long.', 400);
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
        throw new ApiError('User not found.', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isPasswordValid) {
        throw new ApiError('Incorrect current password.', 401);
    }

    const saltRounds = 10;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);

    await prisma.user.update({
        where: { id: userId },
        data: { passwordHash: newPasswordHash }
    });

    return { message: 'Password updated successfully.' };
};
