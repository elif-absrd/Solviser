import { Request, Response } from 'express';
import * as adminService from '../services/admin.service';
import logger from '../middleware/logger.middleware';

export const listAllSubscriptions = async (req: Request, res: Response) => {
    try {
        const { planName, status, page = '1', pageSize = '10' } = req.query;
        
        const filters = {
            planName: planName as string | undefined,
            status: status as string | undefined,
        };
        
        const result = await adminService.getAllSubscriptions(filters, parseInt(page as string), parseInt(pageSize as string));
        
        res.json({
            data: result.subscriptions,
            pagination: {
                page: parseInt(page as string),
                pageSize: parseInt(pageSize as string),
                total: result.totalCount,
                totalPages: Math.ceil(result.totalCount / parseInt(pageSize as string)),
            },
        });
    } catch (error: any) {
        logger.error(`Failed to fetch all subscriptions: ${error.message}`);
        res.status(500).json({ error: 'Could not retrieve subscription data.' });
    }
};

/**
 * Controller to list all system roles (plans).
 */
export const listSystemRoles = async (req: Request, res: Response) => {
  try {
    const systemRoles = await adminService.getSystemRoles();
    res.json(systemRoles);
  } catch (error: any) {
    logger.error(`Failed to fetch system roles: ${error.message}`);
    res.status(500).json({ error: 'Could not retrieve system roles.' });
  }
};

/**
 * Controller to get a single system role by ID.
 */
export const getSystemRoleById = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;
    const role = await adminService.getSystemRole(roleId);

    if (!role) {
      return res.status(404).json({ error: 'System role not found.' });
    }
    res.json(role);

  } catch (error: any) {
    logger.error(`Failed to fetch system role by ID: ${error.message}`);
    res.status(500).json({ error: 'Could not retrieve the system role.' });
  }
};

/**
 * Controller to update permissions for a system role.
 */
export const updateSystemRolePermissions = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;
    const { permissionIds } = req.body;

    // The controller is a good place to validate the request body's shape.
    if (!Array.isArray(permissionIds)) {
      return res.status(400).json({ error: 'permissionIds must be an array.' });
    }

    await adminService.updatePermissionsForRole(roleId, permissionIds);

    res.status(200).json({ message: 'Plan permissions updated successfully.' });
  } catch (error: any) {
    logger.error(`Failed to update plan permissions: ${error.message}`);
    res.status(500).json({ error: 'An error occurred while updating permissions.' });
  }
};

