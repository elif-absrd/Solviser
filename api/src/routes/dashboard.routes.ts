import { Router } from 'express';
import { getStats } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { can } from '../middleware/permission.middleware'; // <-- Import the new permission middleware

const router = Router();

// This route is now protected by both authentication and a specific permission check.
router.get(
  '/stats', 
  authenticateToken, 
  can('dashboard.view'), // <-- ADD THIS: Ensures only users with this permission can access
  getStats
);

export default router;