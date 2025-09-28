import { Router } from 'express';
import * as rbacController from '../controllers/rbac.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { can } from '../middleware/permission.middleware';

const router = Router();

// All routes in this module require the user to be authenticated
router.use(authenticateToken);

// --- Permission Routes ---
// Get a list of all available permissions in the system
router.get('/permissions', rbacController.listPermissions);

// --- Role Routes ---
// List all roles for the user's organization
router.get('/roles', can('role.read'), rbacController.listRoles);
// Create a new role
router.post('/roles', can('role.create'), rbacController.createRole);
// Get details of a specific role
router.get('/roles/:id', can('role.read'), rbacController.getRoleById);
// Update a role's name and its assigned permissions
router.patch('/roles/:id', can('role.update'), rbacController.updateRole);
// Delete a role
router.delete('/roles/:id', can('role.delete'), rbacController.deleteRole);

// --- User & Role Assignment Routes ---
// List all users in the organization with their roles
router.get('/users', can('user.read'), rbacController.listUsers);
// Update the roles for a specific user
router.patch('/users/:userId/roles', can('user.update.role'), rbacController.updateUserRoles);

export default router;
