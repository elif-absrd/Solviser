import { Request, Response } from 'express';
import * as onboardingService from '../services/onboarding.service';
import logger from '../middleware/logger.middleware';

export const submitOnboardingForm = async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId; // From authenticateToken middleware
        const formData = req.body;

        const profile = await onboardingService.createOrUpdateLegalProfile(userId, formData);
        
        logger.info(`Onboarding form submitted/updated for user: ${userId}`);
        res.status(200).json({ message: 'Profile submitted successfully!', profile });
    } catch (error: any) {
        logger.error(`Failed to submit onboarding form for user ${req.user.userId}: ${error.message}`);
        res.status(500).json({ error: 'An error occurred while submitting your profile.' });
    }
};