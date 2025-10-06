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
  getContractTemplates,
  saveDraftContract,
  getDraftContracts,
  uploadContractDocument,
  deleteContractDocument,
  downloadContractBuyerReport,
  notifyBuyer,
  reportDispute
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

// Get contract dropdown options by category (public endpoint)
router.get(
  '/dropdown-options/:category', 
  getDropdownOptions
);

// Get contract templates by type (public endpoint)
router.get(
  '/templates/:type', 
  getContractTemplates
);

// Create a new contract
router.post(
  '/', 
  authenticateToken, 
  can('contract.create'), 
  createContract
);

// Save draft contract
router.post(
  '/drafts', 
  authenticateToken, 
  can('contract.create'), 
  saveDraftContract
);

// Get all draft contracts
router.get(
  '/drafts', 
  authenticateToken, 
  can('contract.view.all'), 
  getDraftContracts
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

// Upload contract document
router.post(
  '/:id/documents',
  authenticateToken,
  can('contract.create'),
  uploadContractDocument
);

// Delete contract document
router.delete(
  '/:id/documents/:documentId',
  authenticateToken,
  can('contract.create'),
  deleteContractDocument
);

// Download contract buyer report
router.get(
  '/reports/buyers',
  authenticateToken,
  can('contract.view.all'),
  downloadContractBuyerReport
);

// Notify buyer
router.post(
  '/notify-buyer',
  authenticateToken,
  can('contract.create'),
  notifyBuyer
);

// Report dispute
router.post(
  '/report-dispute',
  authenticateToken,
  can('contract.create'),
  reportDispute
);

export default router;