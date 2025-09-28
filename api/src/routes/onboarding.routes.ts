import { Router } from 'express';
import * as onboardingController from '../controllers/onboarding.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { can } from '../middleware/permission.middleware'; // Import the can middleware

const router = Router();
router.use(authenticateToken);

// --- ADD THE 'can()' MIDDLEWARE HERE ---
router.post('/submit', can('legal.onboarding'), onboardingController.submitOnboardingForm);

export default router;