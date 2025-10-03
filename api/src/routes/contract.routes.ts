// File: api/src/routes/contract.routes.ts
import { Router } from 'express';
import { 
  getContracts, 
  getContractStats, 
  createContract, 
  getContractById, 
  updateContract, 
  deleteContract,
  getContractInsights,
  getUpcomingMilestones,
  archiveContract,
  getContractsByRisk,
  getFinancialSummary,
  markContractSigned,
  getDropdownOptions,
  getContractTemplates
} from '../controllers/contract.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { can } from '../middleware/permission.middleware';

const router = Router();

// Get all contracts with filtering and pagination
router.get(
  '/', 
  authenticateToken, 
  can('contract.view.all'), 
  getContracts
);

// Get contract statistics
router.get(
  '/stats', 
  authenticateToken, 
  can('contract.view.all'), 
  getContractStats
);

// Get contract insights (charts and analytics)
router.get(
  '/insights', 
  authenticateToken, 
  can('contract.view.all'), 
  getContractInsights
);

// Get upcoming milestones
router.get(
  '/milestones', 
  authenticateToken, 
  can('contract.view.all'), 
  getUpcomingMilestones
);

// Get financial summary
router.get(
  '/financial-summary', 
  authenticateToken, 
  can('contract.view.all'), 
  getFinancialSummary
);

// Get contracts by risk level
router.get(
  '/risk/:riskLevel', 
  authenticateToken, 
  can('contract.view.all'), 
  getContractsByRisk
);

// Get contract dropdown options by category
router.get(
  '/dropdown-options/:category', 
  authenticateToken, 
  can('contract.view.all'), 
  getDropdownOptions
);

// Get contract templates by type
router.get(
  '/templates/:type', 
  authenticateToken, 
  can('contract.view.all'), 
  getContractTemplates
);

// Create a new contract
router.post(
  '/', 
  authenticateToken, 
  can('contract.create'), 
  createContract
);

// Get a specific contract by ID
router.get(
  '/:id', 
  authenticateToken, 
  can('contract.view.all'), 
  getContractById
);

// Update a contract
router.put(
  '/:id', 
  authenticateToken, 
  can('contract.create'), 
  updateContract
);

// Archive a contract
router.patch(
  '/:id/archive', 
  authenticateToken, 
  can('contract.create'), 
  archiveContract
);

// Mark contract as signed
router.patch(
  '/:id/sign', 
  authenticateToken, 
  can('contract.create'), 
  markContractSigned
);

// Delete a contract
router.delete(
  '/:id', 
  authenticateToken, 
  can('contract.create'), 
  deleteContract
);

export default router;