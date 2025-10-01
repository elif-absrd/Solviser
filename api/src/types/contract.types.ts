// File: api/src/types/contract.types.ts

export interface ContractCreateInput {
  // Basic Contract Information
  contractTitle: string;
  contractType: string;
  description?: string;
  
  // Buyer/Client Information
  buyerName: string;
  gstNumber?: string;
  registeredAddress?: string;
  buyerContactPerson?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  
  // Financial Information
  contractValue: number | string;
  currency?: string;
  paymentTerms?: string;
  advancePayment?: number | string;
  penaltyClause?: string;
  
  // Timeline Information
  startDate: string | Date;
  endDate: string | Date;
  renewalDate?: string | Date;
  noticePeriodDays?: number;
  
  // Legal & Compliance
  termsAndClauses?: string;
  governingLaw?: string;
  jurisdiction?: string;
  confidentialityClause?: boolean;
  forceMapjeure?: boolean;
  
  // Business Context
  industry?: string;
  priority?: 'high' | 'medium' | 'low';
  tags?: string[];
  
  // Document Management
  documentPath?: string;
  notes?: string;
}

export interface ContractUpdateInput extends Partial<ContractCreateInput> {
  // Status updates
  status?: 'active' | 'completed' | 'at_risk' | 'defaulted' | 'in_renewal' | 'cancelled' | 'expired';
  
  // Document updates
  signedDocumentPath?: string;
  isSigned?: boolean;
  signedDate?: string | Date;
  
  // Review tracking
  lastReviewDate?: string | Date;
}

export interface ContractFilters {
  buyer?: string;
  industry?: string;
  status?: string;
  riskLevel?: 'low' | 'medium' | 'high';
  contractType?: string;
  priority?: string;
  isSigned?: boolean;
  isArchived?: boolean;
}

export interface ContractPagination {
  page: number;
  pageSize: number;
}

export interface ContractSort {
  field: string;
  order: 'asc' | 'desc';
}

export interface ContractStats {
  totalContracts: number;
  activeContracts: number;
  completedContracts: number;
  atRiskContracts: number;
  totalValue: number;
  averageValue: number;
  highRiskCount: number;
  expiringThisMonth: number;
  renewalsThisMonth: number;
  pendingSignatures: number;
}

export interface ContractFinancialSummary {
  totalContractValue: number;
  totalAdvanceReceived: number;
  pendingAmount: number;
  activeContracts: number;
  renewalContracts: number;
  averageContractValue: number;
}

export interface ContractMilestone {
  id: string;
  type: 'renewal' | 'expiry' | 'review' | 'payment';
  title: string;
  company: string;
  contractValue: number;
  dueDate: Date;
  daysUntilDue: number;
  urgency: 'normal' | 'warning' | 'urgent';
  contractId: string;
}

export interface ContractInsights {
  industryDistribution: Array<{
    industry: string;
    count: number;
    percentage: number;
    value: number;
  }>;
  monthlyGrowth: {
    percentage: number;
    direction: 'up' | 'down';
    text: string;
  };
  totalContracts: number;
  insights: Array<{
    icon: string;
    text: string;
  }>;
}

export interface RiskFactor {
  factor: string;
  weight: number;
  description: string;
}

export type ContractStatus = 'active' | 'completed' | 'at_risk' | 'defaulted' | 'in_renewal' | 'cancelled' | 'expired';
export type ContractPriority = 'high' | 'medium' | 'low';
export type RiskLevel = 'low' | 'medium' | 'high';
export type ContractType = 'service' | 'purchase' | 'lease' | 'maintenance' | 'consulting' | 'licensing' | 'other';