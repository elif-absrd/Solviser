// File: api/src/services/contract.service.ts
// File: api/src/services/contract.service.ts
import prisma from '../prisma';
import {
  ContractCreateInput,
  ContractUpdateInput,
  ContractFinancialSummary,
  ContractMilestone,
  ContractInsights,
  RiskLevel
} from '../types/contract.types';

export interface ContractFilters {
  buyer?: string;
  industry?: string;
  status?: string;
}

export interface ContractPagination {
  page: number;
  pageSize: number;
}

export interface ContractSort {
  field: string;
  order: 'asc' | 'desc';
}

export const getContracts = async (
  organizationId: string, 
  filters: ContractFilters, 
  pagination: ContractPagination, 
  sort: ContractSort
) => {
  // Build where clause based on filters
  const where: any = {
    organizationId,
  };

  if (filters.buyer) {
    where.buyerName = {
      contains: filters.buyer,
      mode: 'insensitive'
    };
  }

  if (filters.industry) {
    where.industry = filters.industry;
  }

  if (filters.status) {
    where.status = filters.status;
  }

  // Build order by clause
  let orderBy: any = {};
  if (sort.field === 'riskScore') {
    orderBy.riskScore = sort.order;
  } else if (sort.field === 'contractValue') {
    orderBy.contractValue = sort.order;
  } else if (sort.field === 'endDate') {
    orderBy.endDate = sort.order;
  } else {
    orderBy.createdAt = 'desc';
  }

  const skip = (pagination.page - 1) * pagination.pageSize;

  const [contracts, total] = await Promise.all([
    prisma.contract.findMany({
      where,
      orderBy,
      skip,
      take: pagination.pageSize,
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      }
    }),
    prisma.contract.count({ where })
  ]);

  return {
    data: contracts,
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total,
      totalPages: Math.ceil(total / pagination.pageSize)
    }
  };
};

export const getContractStats = async (organizationId: string) => {
  // Get contract counts by status
  const [
    activeCount,
    completedCount,
    atRiskCount,
    defaultedCount,
    inRenewalCount,
    totalValue
  ] = await Promise.all([
    prisma.contract.count({
      where: { organizationId, status: 'active' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'completed' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'at_risk' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'defaulted' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'in_renewal' }
    }),
    prisma.contract.aggregate({
      where: { organizationId },
      _sum: { contractValue: true }
    })
  ]);

  // Calculate trends (mock data for now)
  return {
    activeContracts: {
      count: activeCount,
      trend: { direction: 'up', percentage: 8, text: '8% from last month' }
    },
    completedContracts: {
      count: completedCount,
      trend: { text: 'Total completed' }
    },
    contractsAtRisk: {
      count: atRiskCount,
      trend: { direction: 'up', percentage: 3, text: '3% from last month' }
    },
    defaultedContracts: {
      count: defaultedCount,
      trend: { direction: 'up', percentage: 1, text: '1 new this month' }
    },
    inRenewal: {
      count: inRenewalCount,
      trend: { text: '5 due this week' }
    },
    totalValue: totalValue._sum.contractValue || 0
  };
};

export const createContract = async (organizationId: string, userId: string, contractData: ContractCreateInput) => {
  // Generate unique contract number
  const contractNumber = await generateContractNumber(organizationId);
  
  // Calculate risk score based on contract data
  const riskScore = calculateRiskScore(contractData);
  
  // Calculate review dates
  const startDate = new Date(contractData.startDate);
  const endDate = new Date(contractData.endDate);
  const nextReviewDate = new Date(startDate);
  nextReviewDate.setMonth(nextReviewDate.getMonth() + 3); // Review every 3 months
  
  const contract = await prisma.contract.create({
    data: {
      organizationId,
      createdById: userId,
      
      // Basic Information
      contractTitle: contractData.contractTitle,
      contractNumber: contractNumber,
      contractType: contractData.contractType,
      description: contractData.description,
      
      // Buyer Information
      buyerName: contractData.buyerName,
      buyerGstNumber: contractData.gstNumber,
      buyerRegisteredAddress: contractData.registeredAddress,
      buyerContactPerson: contractData.buyerContactPerson,
      buyerEmail: contractData.buyerEmail,
      buyerPhone: contractData.buyerPhone,
      
      // Financial Information
      contractValue: typeof contractData.contractValue === 'string' 
        ? parseFloat(contractData.contractValue) 
        : contractData.contractValue,
      currency: contractData.currency || 'INR',
      paymentTerms: contractData.paymentTerms,
      advancePayment: contractData.advancePayment 
        ? (typeof contractData.advancePayment === 'string' 
            ? parseFloat(contractData.advancePayment) 
            : contractData.advancePayment)
        : 0,
      penaltyClause: contractData.penaltyClause,
      
      // Timeline
      startDate,
      endDate,
      renewalDate: contractData.renewalDate ? new Date(contractData.renewalDate) : null,
      noticePeriodDays: contractData.noticePeriodDays || 30,
      nextReviewDate,
      
      // Status & Risk
      status: 'active',
      riskScore,
      riskFactors: JSON.stringify(assessRiskFactors(contractData)),
      
      // Legal & Compliance
      termsAndClauses: contractData.termsAndClauses,
      governingLaw: contractData.governingLaw || 'Indian Contract Act, 1872',
      jurisdiction: contractData.jurisdiction || 'India',
      confidentialityClause: contractData.confidentialityClause || false,
      forceMapjeure: contractData.forceMapjeure || false,
      
      // Business Context
      industry: contractData.industry || 'General',
      priority: contractData.priority || 'medium',
      tags: contractData.tags ? JSON.stringify(contractData.tags) : null,
      
      // Document Management
      documentPath: contractData.documentPath,
      notes: contractData.notes,
    },
    include: {
      createdBy: {
        select: { name: true, email: true }
      }
    }
  });

  return contract;
};

export const getContractById = async (id: string, organizationId: string) => {
  return await prisma.contract.findFirst({
    where: { id, organizationId },
    include: {
      createdBy: {
        select: { name: true, email: true }
      }
    }
  });
};

export const updateContract = async (id: string, organizationId: string, userId: string, updateData: ContractUpdateInput) => {
  // Recalculate risk score if relevant data changed
  const riskScore = updateData.contractValue || updateData.endDate ? 
    calculateRiskScore(updateData) : undefined;

  const dataToUpdate: any = { 
    ...updateData,
    lastModifiedById: userId,
    updatedAt: new Date()
  };
  
  if (riskScore !== undefined) {
    dataToUpdate.riskScore = riskScore;
    dataToUpdate.riskFactors = JSON.stringify(assessRiskFactors(updateData));
  }

  // Handle date fields
  if (updateData.startDate) dataToUpdate.startDate = new Date(updateData.startDate);
  if (updateData.endDate) dataToUpdate.endDate = new Date(updateData.endDate);
  if (updateData.renewalDate) dataToUpdate.renewalDate = new Date(updateData.renewalDate);
  if (updateData.signedDate) dataToUpdate.signedDate = new Date(updateData.signedDate);

  // Handle JSON fields
  if (updateData.tags) dataToUpdate.tags = JSON.stringify(updateData.tags);

  return await prisma.contract.update({
    where: { id },
    data: dataToUpdate,
    include: {
      createdBy: {
        select: { name: true, email: true }
      }
    }
  });
};

export const deleteContract = async (id: string, organizationId: string) => {
  // Verify the contract belongs to the organization
  const contract = await prisma.contract.findFirst({
    where: { id, organizationId }
  });

  if (!contract) {
    throw new Error('Contract not found');
  }

  return await prisma.contract.delete({
    where: { id }
  });
};

export const getContractInsights = async (organizationId: string) => {
  // Get industry distribution
  const industryStats = await prisma.contract.groupBy({
    by: ['industry'],
    where: { organizationId },
    _count: { industry: true },
    _sum: { contractValue: true }
  });

  const totalContracts = industryStats.reduce((sum: number, stat: any) => sum + stat._count.industry, 0);

  const industryDistribution = industryStats.map((stat: any) => ({
    industry: stat.industry,
    count: stat._count.industry,
    percentage: Math.round((stat._count.industry / totalContracts) * 100),
    value: stat._sum.contractValue || 0
  }));

  // Monthly trends (simplified - you'd want real date-based grouping)
  const monthlyGrowth = {
    percentage: 12,
    direction: 'up',
    text: '12% contract growth in last 3 months'
  };

  return {
    industryDistribution,
    monthlyGrowth,
    totalContracts,
    insights: [
      {
        icon: 'growth',
        text: monthlyGrowth.text
      }
    ]
  };
};

export const getUpcomingMilestones = async (organizationId: string) => {
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  // Get contracts ending soon
  const expiringContracts = await prisma.contract.findMany({
    where: {
      organizationId,
      endDate: {
        gte: new Date(),
        lte: thirtyDaysFromNow
      },
      status: {
        in: ['active', 'in_renewal']
      }
    },
    orderBy: { endDate: 'asc' },
    take: 10
  });

  const milestones = expiringContracts.map((contract: any) => {
    const daysUntilExpiry = Math.ceil(
      (contract.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    let urgency = 'normal';
    if (daysUntilExpiry <= 2) urgency = 'urgent';
    else if (daysUntilExpiry <= 7) urgency = 'warning';

    return {
      id: contract.id,
      type: contract.status === 'in_renewal' ? 'renewal' : 'expiry',
      title: contract.status === 'in_renewal' ? 'Contract Renewal' : 'Contract Expiry',
      company: contract.buyerName,
      contractValue: contract.contractValue,
      dueDate: contract.endDate,
      daysUntilDue: daysUntilExpiry,
      urgency,
      contractId: contract.id
    };
  });

  return milestones;
};

// Archive old contracts
export const archiveContract = async (id: string, organizationId: string, userId: string) => {
  return await prisma.contract.update({
    where: { id },
    data: {
      isArchived: true,
      lastModifiedById: userId,
      updatedAt: new Date()
    }
  });
};

// Get contracts by risk level
export const getContractsByRisk = async (organizationId: string, riskLevel: 'low' | 'medium' | 'high') => {
  let riskRange: { gte?: number; lte?: number } = {};
  
  switch (riskLevel) {
    case 'low':
      riskRange = { lte: 30 };
      break;
    case 'medium':
      riskRange = { gte: 31, lte: 70 };
      break;
    case 'high':
      riskRange = { gte: 71 };
      break;
  }

  return await prisma.contract.findMany({
    where: {
      organizationId,
      riskScore: riskRange,
      isArchived: false
    },
    include: {
      createdBy: {
        select: { name: true, email: true }
      }
    },
    orderBy: { riskScore: 'desc' }
  });
};

// Get financial summary
export const getFinancialSummary = async (organizationId: string) => {
  const contracts = await prisma.contract.findMany({
    where: { 
      organizationId,
      status: { in: ['active', 'in_renewal'] },
      isArchived: false
    },
    select: {
      contractValue: true,
      currency: true,
      advancePayment: true,
      status: true
    }
  });

  const totalValue = contracts.reduce((sum: number, contract: any) => sum + contract.contractValue, 0);
  const totalAdvance = contracts.reduce((sum: number, contract: any) => sum + (contract.advancePayment || 0), 0);
  const activeContracts = contracts.filter((c: any) => c.status === 'active').length;
  const renewalContracts = contracts.filter((c: any) => c.status === 'in_renewal').length;

  return {
    totalContractValue: totalValue,
    totalAdvanceReceived: totalAdvance,
    pendingAmount: totalValue - totalAdvance,
    activeContracts,
    renewalContracts,
    averageContractValue: contracts.length > 0 ? totalValue / contracts.length : 0
  };
};

// Mark contract as signed
export const markContractSigned = async (id: string, organizationId: string, userId: string, signedDocumentPath?: string) => {
  return await prisma.contract.update({
    where: { id },
    data: {
      isSigned: true,
      signedDate: new Date(),
      signedDocumentPath: signedDocumentPath,
      lastModifiedById: userId,
      status: 'active' // Typically signed contracts become active
    }
  });
};

// Helper function to calculate risk score
function calculateRiskScore(contractData: ContractCreateInput | ContractUpdateInput): number {
  let score = 50; // Base score

  // Adjust based on contract value (higher value = higher risk)
  const contractValue = contractData.contractValue || 0;
  const value = typeof contractValue === 'string' ? parseFloat(contractValue) : contractValue;
  if (value > 1000000) score += 20;
  else if (value > 500000) score += 10;
  else if (value < 100000) score -= 10;

  // Adjust based on contract duration
  if (contractData.startDate && contractData.endDate) {
    const duration = new Date(contractData.endDate).getTime() - new Date(contractData.startDate).getTime();
    const months = duration / (1000 * 60 * 60 * 24 * 30);
    if (months > 12) score += 15;
    else if (months < 3) score += 10;
  }

  // Industry-specific risks
  const highRiskIndustries = ['Construction', 'Software Development', 'Consulting'];
  if (contractData.industry && highRiskIndustries.includes(contractData.industry)) score += 10;

  // Payment terms risk
  if (contractData.paymentTerms && contractData.paymentTerms.includes('NET60')) score += 15;
  else if (contractData.paymentTerms && contractData.paymentTerms.includes('NET30')) score += 5;

  return Math.max(0, Math.min(100, score));
}

// Helper function to generate unique contract number
async function generateContractNumber(organizationId: string): Promise<string> {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  
  // Get count of contracts this month for this organization
  const startOfMonth = new Date(year, new Date().getMonth(), 1);
  const endOfMonth = new Date(year, new Date().getMonth() + 1, 0);
  
  const contractCount = await prisma.contract.count({
    where: {
      organizationId,
      createdAt: {
        gte: startOfMonth,
        lte: endOfMonth
      }
    }
  });
  
  const sequence = String(contractCount + 1).padStart(3, '0');
  return `CON-${year}${month}-${sequence}`;
}

// Helper function to assess risk factors
function assessRiskFactors(contractData: ContractCreateInput | ContractUpdateInput): string[] {
  const riskFactors: string[] = [];
  
  const contractValue = contractData.contractValue || 0;
  const value = typeof contractValue === 'string' ? parseFloat(contractValue) : contractValue;
  
  if (!contractData.startDate || !contractData.endDate) return riskFactors;
  
  const startDate = new Date(contractData.startDate);
  const endDate = new Date(contractData.endDate);
  const durationDays = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
  
  if (value > 1000000) riskFactors.push('High Contract Value');
  if (durationDays > 365) riskFactors.push('Long Duration Contract');
  
  const advancePayment = contractData.advancePayment || 0;
  const advance = typeof advancePayment === 'string' ? parseFloat(advancePayment) : advancePayment;
  if (advance < value * 0.1) {
    riskFactors.push('Low Advance Payment');
  }
  if (contractData.paymentTerms && contractData.paymentTerms.includes('NET60')) {
    riskFactors.push('Extended Payment Terms');
  }
  if (!contractData.penaltyClause) riskFactors.push('No Penalty Clause');
  
  return riskFactors;
}

// Get dropdown options by category
export const getDropdownOptions = async (category: string) => {
  try {
    const categoryRecord = await prisma.contractDropdownCategory.findUnique({
      where: { name: category },
      include: {
        options: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      }
    });

    if (!categoryRecord) {
      throw new Error('Category not found');
    }

    return {
      category: categoryRecord.name,
      options: categoryRecord.options.map(option => ({
        id: option.id,
        value: option.value,
        label: option.label,
        description: option.description,
        metadata: option.metadata
      }))
    };
  } catch (error) {
    throw new Error(`Failed to get dropdown options: ${error}`);
  }
};

// Get contract templates by type
export const getContractTemplates = async (type: string) => {
  try {
    const templates = await prisma.contractTemplate.findMany({
      where: { 
        type,
        isActive: true 
      },
      orderBy: { name: 'asc' }
    });

    return templates.map(template => ({
      id: template.id,
      name: template.name,
      type: template.type,
      generalTerms: template.generalTerms,
      shippingTerms: template.shippingTerms,
      paymentTerms: template.paymentTerms,
      deliveryTerms: template.deliveryTerms,
      disputeTerms: template.disputeTerms,
      otherTerms: template.otherTerms,
      isDefault: template.isDefault
    }));
  } catch (error) {
    throw new Error(`Failed to get contract templates: ${error}`);
  }
};