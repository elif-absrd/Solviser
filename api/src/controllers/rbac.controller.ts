import { Request, Response } from 'express';
import * as rbacService from '../services/rbac.service';
import logger from '../middleware/logger.middleware';

// --- Permission Controller ---
export const listPermissions = async (req: Request, res: Response) => {
    try {
        const permissions = await rbacService.getAllPermissions();
        res.json(permissions);
    } catch (error: any) {
        logger.error(`Failed to fetch permissions: ${error.message}`);
        res.status(500).json({ error: 'Could not retrieve permissions.' });
    }
};

// --- Role Controllers ---
export const listRoles = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const roles = await rbacService.getRolesByOrganization(organizationId);
        res.json(roles);
    } catch (error: any) {
        logger.error(`Failed to fetch roles for org ${req.user?.organizationId}: ${error.message}`);
        res.status(500).json({ error: 'Could not retrieve roles.' });
    }
};

export const createRole = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const { name, permissionIds } = req.body;
        const newRole = await rbacService.createRoleForOrganization(organizationId, name, permissionIds);
        res.status(201).json(newRole);
    } catch (error: any) {
        logger.error(`Failed to create role for org ${req.user?.organizationId}: ${error.message}`);
        res.status(400).json({ error: error.message || 'Could not create role.' });
    }
};

export const getRoleById = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const { id } = req.params;
        const role = await rbacService.getRoleDetails(id, organizationId);
        res.json(role);
    } catch (error: any) {
        logger.error(`Failed to fetch role ${req.params.id}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

export const updateRole = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const { id } = req.params;
        const { name, permissionIds } = req.body;
        const updatedRole = await rbacService.updateRoleDetails(id, organizationId, name, permissionIds);
        res.json(updatedRole);
    } catch (error: any) {
        logger.error(`Failed to update role ${req.params.id}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

export const deleteRole = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const { id } = req.params;
        await rbacService.deleteRoleFromOrganization(id, organizationId);
        res.status(204).send();
    } catch (error: any) {
        logger.error(`Failed to delete role ${req.params.id}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};

// --- User Controllers ---
export const listUsers = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const users = await rbacService.getUsersByOrganization(organizationId);
        res.json(users);
    } catch (error: any) {
        logger.error(`Failed to list users for org ${req.user?.organizationId}: ${error.message}`);
        res.status(500).json({ error: 'Could not retrieve users.' });
    }
};

export const updateUserRoles = async (req: Request, res: Response) => {
    try {
        const { organizationId } = req.user!;
        const { userId } = req.params;
        const { roleIds } = req.body;
        const updatedUser = await rbacService.updateUserRoles(userId, organizationId, roleIds);
        res.json(updatedUser);
    } catch (error: any) {
        logger.error(`Failed to update roles for user ${req.params.userId}: ${error.message}`);
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};
