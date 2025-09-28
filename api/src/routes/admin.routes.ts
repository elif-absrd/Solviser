import { Router } from 'express';
import * as adminController from '../controllers/admin.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { isSuperAdmin } from '../middleware/superAdmin.middleware';
import { can } from '../middleware/permission.middleware';
const router = Router();

// All routes in this module require the user to be an authenticated Super Admin
router.use(authenticateToken, isSuperAdmin);

// Get a list of all subscriptions on the platform
router.get('/subscriptions', can('billing.manage'), adminController.listAllSubscriptions);

/**
 * @route   GET /api/admin/system-roles
 * @desc    Get a list of all system roles (i.e., subscription plans).
 * @access  Super Admin
 */
router.get('/system-roles', adminController.listSystemRoles);

/**
 * @route   GET /api/admin/system-roles/:roleId
 * @desc    Get details of a single system role, including its permissions.
 * @access  Super Admin
 */
router.get('/system-roles/:roleId', adminController.getSystemRoleById);

/**
 * @route   PATCH /api/admin/system-roles/:roleId/permissions
 * @desc    Update the permissions for a specific system role (plan).
 * @access  Super Admin
 */
router.patch('/system-roles/:roleId/permissions', adminController.updateSystemRolePermissions);


export default router;
