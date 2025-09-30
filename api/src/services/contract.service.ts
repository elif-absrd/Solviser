// File: api/src/services/contract.service.ts
import prisma from '../prisma';

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

export const createContract = async (organizationId: string, userId: string, contractData: any) => {
  // Calculate risk score based on contract data (simplified)
  const riskScore = calculateRiskScore(contractData);
  
  const contract = await prisma.contract.create({
    data: {
      organizationId,
      createdById: userId,
      buyerName: contractData.buyerName,
      buyerGstNumber: contractData.gstNumber,
      buyerRegisteredAddress: contractData.registeredAddress,
      contractTitle: contractData.contractTitle,
      contractType: contractData.contractType,
      startDate: new Date(contractData.startDate),
      endDate: new Date(contractData.endDate),
      contractValue: parseFloat(contractData.contractValue),
      termsAndClauses: contractData.termsAndClauses,
      status: 'active',
      riskScore,
      industry: contractData.industry || 'General',
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

export const updateContract = async (id: string, organizationId: string, updateData: any) => {
  // Recalculate risk score if relevant data changed
  const riskScore = updateData.contractValue || updateData.endDate ? 
    calculateRiskScore(updateData) : undefined;

  const dataToUpdate: any = { ...updateData };
  if (riskScore !== undefined) {
    dataToUpdate.riskScore = riskScore;
  }

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

  const totalContracts = industryStats.reduce((sum, stat) => sum + stat._count.industry, 0);

  const industryDistribution = industryStats.map(stat => ({
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

  const milestones = expiringContracts.map(contract => {
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

// Helper function to calculate risk score
function calculateRiskScore(contractData: any): number {
  let score = 50; // Base score

  // Adjust based on contract value (higher value = higher risk)
  const value = parseFloat(contractData.contractValue || 0);
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

  // Random variation for demo purposes
  score += Math.floor(Math.random() * 20) - 10;

  return Math.max(0, Math.min(100, score));
}