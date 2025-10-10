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
      contains: filters.buyer
    };
  }

  if (filters.industry) {
    where.industry = filters.industry;
  }

  if (filters.status) {
    // Map lowercase status to uppercase enum values
    const statusMap: { [key: string]: string } = {
      'draft': 'DRAFT',
      'active': 'ACTIVE',
      'completed': 'COMPLETED',
      'at_risk': 'AT_RISK',
      'terminated': 'TERMINATED',
      'renewed': 'RENEWED',
      'expired': 'EXPIRED',
      'disputed': 'DISPUTED',
      'pending_review': 'PENDING_REVIEW',
      'under_review': 'UNDER_REVIEW',
      'approved': 'APPROVED'
    };
    
    where.status = statusMap[filters.status.toLowerCase()] || filters.status.toUpperCase();
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
      where: { organizationId, status: 'ACTIVE' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'COMPLETED' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'AT_RISK' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'TERMINATED' }
    }),
    prisma.contract.count({
      where: { organizationId, status: 'RENEWED' }
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
  // Validate inputs
  if (!organizationId) {
    throw new Error('Organization ID is required');
  }
  if (!userId) {
    throw new Error('User ID is required');
  }

  // Ensure organization exists
  const organization = await prisma.organization.findUnique({
    where: { id: organizationId }
  });
  
  if (!organization) {
    // Create development organization if it doesn't exist
    if (process.env.NODE_ENV === 'development' && organizationId === 'dev-org-id') {
      await prisma.organization.create({
        data: {
          id: 'dev-org-id',
          name: 'Development Organization',
          ownerId: 'dev-user-id'
        }
      });
    } else {
      throw new Error('Organization not found');
    }
  }

  // Ensure user exists
  const user = await prisma.user.findUnique({
    where: { id: userId }
  });
  
  if (!user) {
    // Create development user if it doesn't exist
    if (process.env.NODE_ENV === 'development' && userId === 'dev-user-id') {
      await prisma.user.create({
        data: {
          id: 'dev-user-id',
          name: 'Development User',
          email: 'dev@example.com',
          passwordHash: 'dev-hash',
          organizationId: 'dev-org-id',
          isOwner: true,
          isSuperAdmin: true
        }
      });
    } else {
      throw new Error('User not found');
    }
  }

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
      status: 'ACTIVE',
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
      
      // Import Contract Specific Fields
      isImportContract: contractData.isImportContract || false,
      documentsSkipped: contractData.documentsSkipped || false,
      presentationDeadline: contractData.presentationDeadline ? new Date(contractData.presentationDeadline) : null,
      
      // Document flags
      hasCommercialInvoice: contractData.hasCommercialInvoice || false,
      hasPackingList: contractData.hasPackingList || false,
      hasBillOfLanding: contractData.hasBillOfLanding || false,
      hasCertificateOfOrigin: contractData.hasCertificateOfOrigin || false,
      hasInsuranceCertificate: contractData.hasInsuranceCertificate || false,
      hasPhytosanitaryCertificate: contractData.hasPhytosanitaryCertificate || false,
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
        in: ['ACTIVE', 'RENEWED']
      }
    },
    orderBy: { endDate: 'asc' },
    take: 10
  });

  // Get contracts with document presentation deadlines
  const documentDeadlineContracts = await prisma.contract.findMany({
    where: {
      organizationId,
      documentsSkipped: true,
      presentationDeadline: {
        gte: new Date(),
        lte: thirtyDaysFromNow
      },
      status: {
        in: ['ACTIVE', 'DRAFT']
      }
    },
    orderBy: { presentationDeadline: 'asc' },
    take: 10
  });

  // Process contract expiry milestones
  const expiryMilestones = expiringContracts.map((contract: any) => {
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

  // Process document presentation deadlines
  const documentMilestones = documentDeadlineContracts.map((contract: any) => {
    const daysUntilDeadline = Math.ceil(
      (contract.presentationDeadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );

    let urgency = 'normal';
    if (daysUntilDeadline <= 1) urgency = 'urgent';
    else if (daysUntilDeadline <= 3) urgency = 'warning';

    return {
      id: `${contract.id}_documents`,
      type: 'document_deadline',
      title: 'Document Presentation Required',
      company: contract.buyerName,
      contractValue: contract.contractValue,
      dueDate: contract.presentationDeadline,
      daysUntilDue: daysUntilDeadline,
      urgency,
      contractId: contract.id
    };
  });

  // Combine and sort all milestones by due date
  const allMilestones = [...expiryMilestones, ...documentMilestones];
  allMilestones.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return allMilestones.slice(0, 10); // Return top 10 upcoming milestones
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
      options: categoryRecord.options.map((option: any) => ({
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

    return templates.map((template: any) => ({
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

// Upload contract document
export const uploadContractDocument = async (contractId: string, organizationId: string, documentData: {
  documentName: string;
  documentData: string;
  documentType: string;
}) => {
  try {
    // Verify contract exists and belongs to organization
    const contract = await prisma.contract.findFirst({
      where: { id: contractId, organizationId }
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    // Check if there are already 2 documents
    const existingDocuments = await prisma.contractDocument.count({
      where: { contractId }
    });

    if (existingDocuments >= 2) {
      throw new Error('Maximum of 2 documents allowed per contract');
    }

    // Calculate file size (approximate from base64)
    const fileSize = Math.round((documentData.documentData.length * 3) / 4);

    const document = await prisma.contractDocument.create({
      data: {
        contractId,
        documentName: documentData.documentName,
        documentType: documentData.documentType,
        documentData: documentData.documentData,
        fileSize,
        uploadedBy: contract.createdById
      }
    });

    return {
      message: 'Document uploaded successfully',
      document: {
        id: document.id,
        documentName: document.documentName,
        documentType: document.documentType,
        fileSize: document.fileSize,
        createdAt: document.createdAt
      }
    };
  } catch (error) {
    throw new Error(`Failed to upload document: ${error}`);
  }
};

// Delete contract document
export const deleteContractDocument = async (contractId: string, documentId: string, organizationId: string) => {
  try {
    // Verify contract exists and belongs to organization
    const contract = await prisma.contract.findFirst({
      where: { id: contractId, organizationId }
    });

    if (!contract) {
      throw new Error('Contract not found');
    }

    const document = await prisma.contractDocument.findFirst({
      where: { id: documentId, contractId }
    });

    if (!document) {
      throw new Error('Document not found');
    }

    await prisma.contractDocument.delete({
      where: { id: documentId }
    });

    return { message: 'Document deleted successfully' };
  } catch (error) {
    throw new Error(`Failed to delete document: ${error}`);
  }
};

// Generate contract buyer report PDF
export const generateContractBuyerReport = async (organizationId: string) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { organizationId },
      include: {
        createdBy: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Simple PDF generation using a basic approach
    const reportData = {
      title: 'Contract Buyer Report',
      generatedOn: new Date().toLocaleDateString(),
      totalContracts: contracts.length,
      contracts: contracts.map((contract: any) => ({
        title: contract.contractTitle,
        buyer: contract.buyerName,
        gstNumber: contract.buyerGstNumber || 'N/A',
        value: `${contract.currency} ${contract.contractValue.toLocaleString()}`,
        status: contract.status,
        createdAt: contract.createdAt.toLocaleDateString()
      }))
    };

    // For now, return a JSON report that can be converted to PDF on frontend
    // In production, you'd use a proper PDF library like pdfkit
    const reportContent = JSON.stringify(reportData, null, 2);
    return Buffer.from(reportContent, 'utf8');
  } catch (error) {
    throw new Error(`Failed to generate buyer report: ${error}`);
  }
};

// Notify buyer
export const notifyBuyer = async (
  contractId: string,
  gstNumber: string,
  message: string,
  notificationType: string,
  organizationId: string,
  sentByUserId: string
) => {
  try {
    // Verify contract exists if contractId is provided
    if (contractId) {
      const contract = await prisma.contract.findFirst({
        where: { id: contractId, organizationId, buyerGstNumber: gstNumber }
      });

      if (!contract) {
        throw new Error('Contract not found or GST number mismatch');
      }
    }

    const notification = await prisma.buyerNotification.create({
      data: {
        contractId: contractId || null,
        buyerGstNumber: gstNumber,
        message,
        notificationType,
        sentBy: sentByUserId,
        organizationId
      }
    });

    return {
      message: 'Notification sent successfully',
      notification: {
        id: notification.id,
        buyerGstNumber: notification.buyerGstNumber,
        message: notification.message,
        notificationType: notification.notificationType,
        status: notification.status,
        createdAt: notification.createdAt
      }
    };
  } catch (error) {
    throw new Error(`Failed to notify buyer: ${error}`);
  }
};

// Report dispute
export const reportDispute = async (disputeData: {
  contractId?: string;
  buyerGstNumber: string;
  disputeReason: string;
  description: string;
  evidenceFiles?: string[];
  reportedByUserId: string;
  organizationId: string;
}) => {
  try {
    // Verify contract exists if contractId is provided
    if (disputeData.contractId) {
      const contract = await prisma.contract.findFirst({
        where: { 
          id: disputeData.contractId, 
          organizationId: disputeData.organizationId,
          buyerGstNumber: disputeData.buyerGstNumber
        }
      });

      if (!contract) {
        throw new Error('Contract not found or GST number mismatch');
      }
    }

    const dispute = await prisma.contractDispute.create({
      data: {
        contractId: disputeData.contractId || null,
        buyerGstNumber: disputeData.buyerGstNumber,
        disputeReason: disputeData.disputeReason,
        description: disputeData.description,
        evidenceFiles: disputeData.evidenceFiles ? JSON.stringify(disputeData.evidenceFiles) : null,
        reportedBy: disputeData.reportedByUserId,
        organizationId: disputeData.organizationId
      }
    });

    return {
      message: 'Dispute reported successfully',
      dispute: {
        id: dispute.id,
        buyerGstNumber: dispute.buyerGstNumber,
        disputeReason: dispute.disputeReason,
        description: dispute.description,
        status: dispute.status,
        priority: dispute.priority,
        createdAt: dispute.createdAt
      }
    };
  } catch (error) {
    throw new Error(`Failed to report dispute: ${error}`);
  }
};

// Generate analytics report data
export const generateAnalyticsReport = async (organizationId: string) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { organizationId },
      include: {
        milestones: true
      }
    });

    const totalContracts = contracts.length;
    const activeContracts = contracts.filter((c: any) => c.status === 'ACTIVE').length;
    const completedContracts = contracts.filter((c: any) => c.status === 'COMPLETED').length;
    const totalValue = contracts.reduce((sum: number, c: any) => sum + Number(c.contractValue), 0);
    
    const industryDistribution = contracts.reduce((acc: any, contract: any) => {
      acc[contract.industry] = (acc[contract.industry] || 0) + 1;
      return acc;
    }, {});

    const riskDistribution = contracts.reduce((acc: any, contract: any) => {
      acc[contract.riskLevel] = (acc[contract.riskLevel] || 0) + 1;
      return acc;
    }, {});

    return {
      totalContracts,
      activeContracts,
      completedContracts,
      totalValue,
      industryDistribution,
      riskDistribution,
      contracts: contracts.slice(0, 10) // Top 10 contracts
    };
  } catch (error) {
    throw new Error(`Failed to generate analytics report: ${error}`);
  }
};

// Generate analytics PDF (simplified)
export const generateAnalyticsPDF = async (data: any) => {
  // For now, return a simple buffer. In production, use a PDF library like PDFKit
  const content = `Contract Analytics Report\n\nTotal Contracts: ${data.totalContracts}\nActive Contracts: ${data.activeContracts}\nCompleted Contracts: ${data.completedContracts}\nTotal Value: $${data.totalValue.toLocaleString()}`;
  return Buffer.from(content, 'utf-8');
};

// Generate risk analysis data
export const generateRiskAnalysis = async (organizationId: string) => {
  try {
    const contracts = await prisma.contract.findMany({
      where: { organizationId }
    });

    const highRiskContracts = contracts.filter((c: any) => c.riskLevel === 'HIGH').length;
    const mediumRiskContracts = contracts.filter((c: any) => c.riskLevel === 'MEDIUM').length;
    const lowRiskContracts = contracts.filter((c: any) => c.riskLevel === 'LOW').length;
    
    const riskFactors = {
      paymentDelays: contracts.filter((c: any) => c.paymentTerms && parseInt(c.paymentTerms) > 30).length,
      longTermContracts: contracts.filter((c: any) => {
        const start = new Date(c.startDate);
        const end = new Date(c.endDate);
        const diffMonths = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30);
        return diffMonths > 12;
      }).length,
      highValueContracts: contracts.filter((c: any) => Number(c.contractValue) > 100000).length
    };

    return {
      totalContracts: contracts.length,
      highRiskContracts,
      mediumRiskContracts,
      lowRiskContracts,
      riskFactors,
      recommendations: [
        'Review payment terms for high-value contracts',
        'Implement milestone-based payments',
        'Regular risk assessment updates'
      ]
    };
  } catch (error) {
    throw new Error(`Failed to generate risk analysis: ${error}`);
  }
};

// Generate risk analysis PDF (simplified)
export const generateRiskAnalysisPDF = async (data: any) => {
  // For now, return a simple buffer. In production, use a PDF library like PDFKit
  const content = `Risk Analysis Report\n\nHigh Risk Contracts: ${data.highRiskContracts}\nMedium Risk Contracts: ${data.mediumRiskContracts}\nLow Risk Contracts: ${data.lowRiskContracts}\n\nRecommendations:\n${data.recommendations.join('\n')}`;
  return Buffer.from(content, 'utf-8');
};