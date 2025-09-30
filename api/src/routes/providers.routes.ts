import { Router } from 'express';
import * as providerController from '../controllers/providers.controller';
import { can } from '../middleware/permission.middleware';
import { authenticateToken } from '../middleware/auth.middleware'; // 1. Import authenticateToken

const router = Router();

// 2. Use the middleware for all routes in this file
router.use(authenticateToken);

/**
 * @route   GET /api/providers
 * @desc    Get a paginated and filtered list of legal service providers.
 * @access  Users with 'legal.view' permission
 */
router.get('/', can('legal.view'), providerController.listProviders);

export default router;