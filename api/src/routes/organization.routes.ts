import { Router } from 'express';
import { setupOrganization } from '../controllers/organization.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// This route is protected. Only authenticated users can access it.
router.patch('/setup', authenticateToken, setupOrganization);

export default router;
