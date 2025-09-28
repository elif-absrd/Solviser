import { Request, Response } from 'express';
import * as userService from '../services/user.service';
import logger from '../middleware/logger.middleware';

export const getProfile = async (req: Request, res: Response) => {
    try {
        const userProfile = await userService.getUserProfile(req.user.userId);
        res.json(userProfile);
    } catch (error: any) {
        logger.error(`Failed to get profile for user ${req.user?.userId}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const updatedUser = await userService.updateUserProfile(req.user.userId, name);
        res.json({ message: 'Profile updated successfully.', user: updatedUser });
    } catch (error: any) {
        logger.error(`Failed to update profile for user ${req.user?.userId}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

export const updatePassword = async (req: Request, res: Response) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const result = await userService.updateUserPassword(req.user.userId, currentPassword, newPassword);
        res.json(result);
    } catch (error: any) {
        logger.error(`Failed to update password for user ${req.user?.userId}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};
