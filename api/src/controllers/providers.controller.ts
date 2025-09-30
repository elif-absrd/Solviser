import { Request, Response } from 'express';
import * as providerService from '../services/providers.service';
import logger from '../middleware/logger.middleware';

export const listProviders = async (req: Request, res: Response) => {
    try {
        const { city, search, page = '1', pageSize = '6' } = req.query;
        
        const filters = {
            city: city as string | undefined,
            search: search as string | undefined,
        };
        
        const result = await providerService.getProviders(
            filters, 
            parseInt(page as string), 
            parseInt(pageSize as string)
        );
        
        res.json({
            data: result.providers,
            pagination: {
                page: parseInt(page as string),
                pageSize: parseInt(pageSize as string),
                total: result.totalCount,
                totalPages: Math.ceil(result.totalCount / parseInt(pageSize as string)),
            },
        });
    } catch (error: any) {
        logger.error(`Failed to fetch providers: ${error.message}`);
        res.status(500).json({ error: 'Could not retrieve provider data.' });
    }
};