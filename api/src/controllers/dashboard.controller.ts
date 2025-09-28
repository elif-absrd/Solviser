import { Request, Response } from 'express';
import * as dashboardService from '../services/dashboard.service';
import logger from '../middleware/logger.middleware';

export const getStats = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const stats = await dashboardService.getDashboardStats(user.organizationId);
    res.json(stats);
  } catch (error: any) {
    logger.error(`Dashboard Stats Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics.' });
  }
};
