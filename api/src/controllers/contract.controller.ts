// File: api/src/controllers/contract.controller.ts
import { Request, Response } from 'express';
import * as contractService from '../services/contract.service';
import logger from '../middleware/logger.middleware';

export const getContracts = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { 
      page = 1, 
      pageSize = 10, 
      buyer, 
      industry, 
      status, 
      sortBy = 'riskScore',
      sortOrder = 'desc'
    } = req.query;

    const filters = {
      buyer: buyer as string,
      industry: industry as string,
      status: status as string,
    };

    const pagination = {
      page: parseInt(page as string),
      pageSize: parseInt(pageSize as string),
    };

    const sort = {
      field: sortBy as string,
      order: sortOrder as 'asc' | 'desc'
    };

    const result = await contractService.getContracts(user.organizationId, filters, pagination, sort);
    res.json(result);
  } catch (error: any) {
    logger.error(`Get Contracts Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to retrieve contracts.' });
  }
};

export const getContractStats = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const stats = await contractService.getContractStats(user.organizationId);
    res.json(stats);
  } catch (error: any) {
    logger.error(`Get Contract Stats Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to retrieve contract statistics.' });
  }
};

export const createContract = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const contractData = req.body;
    
    const contract = await contractService.createContract(user.organizationId, user.id, contractData);
    res.status(201).json({ message: 'Contract created successfully!', contract });
  } catch (error: any) {
    logger.error(`Create Contract Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to create contract.' });
  }
};

export const getContractById = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    
    const contract = await contractService.getContractById(id, user.organizationId);
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found.' });
    }
    
    res.json(contract);
  } catch (error: any) {
    logger.error(`Get Contract Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to retrieve contract.' });
  }
};

export const updateContract = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    const updateData = req.body;
    
    const contract = await contractService.updateContract(id, user.organizationId, updateData);
    res.json({ message: 'Contract updated successfully!', contract });
  } catch (error: any) {
    logger.error(`Update Contract Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to update contract.' });
  }
};

export const deleteContract = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const { id } = req.params;
    
    await contractService.deleteContract(id, user.organizationId);
    res.json({ message: 'Contract deleted successfully!' });
  } catch (error: any) {
    logger.error(`Delete Contract Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to delete contract.' });
  }
};

export const getContractInsights = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const insights = await contractService.getContractInsights(user.organizationId);
    res.json(insights);
  } catch (error: any) {
    logger.error(`Get Contract Insights Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to retrieve contract insights.' });
  }
};

export const getUpcomingMilestones = async (req: Request, res: Response) => {
  try {
    const user = req.user!;
    const milestones = await contractService.getUpcomingMilestones(user.organizationId);
    res.json(milestones);
  } catch (error: any) {
    logger.error(`Get Upcoming Milestones Error: ${error.message}`, {
      userId: req.user?.userId,
    });
    res.status(500).json({ error: 'Failed to retrieve upcoming milestones.' });
  }
};