import { Router } from 'express';
import * as verificationController from '../controllers/verification.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { can } from '../middleware/permission.middleware'; // Import the can middleware

const router = Router();
router.use(authenticateToken);

// --- ADD THE 'can()' MIDDLEWARE HERE ---
router.post('/gst', can('legal.onboarding'), verificationController.verifyGst);

export default router;