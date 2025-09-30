import { Request, Response } from 'express';
import * as organizationService from '../services/organization.service';
import logger from '../middleware/logger.middleware';

export const setupOrganization = async (req: Request, res: Response) => {
  try {
    // The user object is attached by the authentication middleware.
    // We assert that req.user exists because this route is protected.
    const user = req.user!; 
    const { organizationName } = req.body;

    if (!organizationName) {
      return res.status(400).json({ error: 'Organization name is required.' });
    }

    // Delegate the business logic to the service layer
    const updatedOrganization = await organizationService.updateOrganizationName(user, organizationName);

    res.status(200).json({
      message: 'Organization setup successful!',
      organization: updatedOrganization,
    });

  } catch (error: any) {
    logger.error(`Organization Setup Error: ${error.message}`, {
      userId: req.user?.userId,
      organizationId: req.user?.organizationId,
      statusCode: error.statusCode,
    });
    const statusCode = error.statusCode || 500;
    res.status(statusCode).json({ error: error.message || 'An error occurred during organization setup.' });
  }
};

