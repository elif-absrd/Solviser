import React, { useState, useEffect } from "react";
import api from '@/lib/api';
import { RotateCcw, MoreVertical } from "lucide-react";

interface Contract {
  id: string;
  contractTitle: string;
  buyerName: string;
  contractValue: number;
  startDate: string;
  endDate: string;
  status: string;
  riskScore: number;
  industry: string;
  createdAt: string;
  createdBy: {
    name: string;
    email: string;
  };
}

interface ContractListProps {
  filters: {
    buyer: string;
    industry: string;
    status: string;
    sortBy: string;
  };
}

interface PaginationData {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

export default function ContractList({ filters }: ContractListProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = async (page = 1) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: pagination.pageSize.toString(),
        sortBy: filters.sortBy,
        sortOrder: 'desc'
      });

      if (filters.buyer) params.append('buyer', filters.buyer);
      if (filters.industry) params.append('industry', filters.industry);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/contracts?${params.toString()}`);
      setContracts(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      console.error('Failed to fetch contracts:', err);
      setError('Failed to load contracts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContracts(1);
  }, [filters]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const getRiskLevel = (score: number): { label: string; className: string } => {
    if (score >= 70) return { label: `High Risk (${score})`, className: 'high-risk' };
    if (score >= 40) return { label: `Medium Risk (${score})`, className: 'medium-risk' };
    return { label: `Low Risk (${score})`, className: 'low-risk' };
  };

  const getStatusClassName = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'active':
      case 'open': 
        return 'status-open';
      case 'at_risk': 
        return 'status-at-risk';
      case 'completed': 
        return 'status-completed';
      case 'in_renewal': 
        return 'status-renewal';
      case 'defaulted': 
        return 'status-defaulted';
      case 'cancelled': 
        return 'status-cancelled';
      default: 
        return 'status-default';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'at_risk': return 'At Risk';
      case 'in_renewal': return 'In Renewal';
      default: return status.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diff = now.getTime() - past.getTime();
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);
    
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchContracts(newPage);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <RotateCcw className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={() => fetchContracts(pagination.page)}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (contracts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No contracts found matching your filters.</p>
      </div>
    );
  }

  return (
    <>
      <style jsx>{`
        .contract-card {
          border-radius: 8px;
          background-color: #FFFFFF;
          box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
          width: 100%;
          margin-bottom: 16px;
          transition: transform 0.2s, box-shadow 0.2s;
          cursor: pointer;
        }

        .contract-card:hover {
          transform: translateY(-2px);
          box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.15);
        }

        .contract-header {
          border-bottom: 1px solid #F3F4F6;
          display: flex;
          width: 100%;
          padding: 17px 16px;
          align-items: stretch;
          gap: 20px;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .contract-company {
          display: flex;
          align-items: stretch;
          gap: 12px;
          line-height: 1;
        }

        .company-logo {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          margin: auto 0;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #3B82F6, #8B5CF6);
          color: white;
          font-weight: 600;
          font-size: 14px;
        }

        .company-info {
          display: flex;
          padding: 2px 0 8px 0;
          flex-direction: column;
          align-items: stretch;
        }

        .company-name {
          color: #1F2937;
          font-size: 16px;
          font-weight: 600;
        }

        .contract-id {
          color: #6B7280;
          font-size: 14px;
          font-weight: 400;
          align-self: flex-start;
          margin-top: 8px;
        }

        .risk-badge {
          margin: auto 0;
          font-size: 12px;
          font-weight: 500;
        }

        .high-risk {
          border-radius: 9999px;
          background-color: #FEE2E2;
          padding: 5px 12px;
          color: #DC2626;
        }

        .medium-risk {
          border-radius: 9999px;
          background-color: #FEF3C7;
          padding: 5px 12px;
          color: #D97706;
        }

        .low-risk {
          border-radius: 9999px;
          background-color: #D1FAE5;
          padding: 5px 12px;
          color: #059669;
        }

        .contract-details {
          display: flex;
          padding: 16px;
          align-items: stretch;
          gap: 16px;
          line-height: 1;
          flex-wrap: wrap;
        }

        .detail-item {
          display: flex;
          padding: 1px 36px 7px 0;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        .detail-label {
          color: #6B7280;
          font-size: 14px;
          font-weight: 400;
        }

        .detail-value {
          color: #1F2937;
          font-size: 16px;
          font-weight: 600;
          margin-top: 10px;
        }

        .status-at-risk {
          color: #F59E0B;
        }

        .status-open {
          color: #10B981;
        }

        .status-active {
          color: #10B981;
        }

        .status-renewal {
          color: #3B82F6;
        }

        .status-completed {
          color: #6B7280;
        }

        .status-defaulted {
          color: #EF4444;
        }

        .status-cancelled {
          color: #6B7280;
        }

        .status-default {
          color: #6B7280;
        }

        .contract-footer {
          display: flex;
          padding: 17px 16px;
          align-items: stretch;
          gap: 20px;
          font-size: 14px;
          color: #6B7280;
          font-weight: 400;
          line-height: 1;
          flex-wrap: wrap;
          justify-content: space-between;
        }

        .last-updated {
          margin: auto 0;
        }

        .contract-actions {
          background-color: #F3F4F6;
          border-radius: 6px;
          padding: 8px 16px;
          color: #6B7280;
          font-size: 12px;
          transition: background-color 0.2s;
        }

        .contract-actions:hover {
          background-color: #E5E7EB;
        }

        .pagination {
          display: flex;
          margin-top: 16px;
          width: 100%;
          padding: 0 70px;
          align-items: stretch;
          gap: 6px;
          font-size: 14px;
          color: #6B7280;
          font-weight: 400;
          line-height: 1.5;
          justify-content: center;
        }

        .pagination-arrow {
          width: 32px;
          height: 32px;
          cursor: pointer;
          border-radius: 4px;
          border: 1px solid #D1D5DB;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.2s;
        }

        .pagination-arrow:hover:not(:disabled) {
          background-color: #F3F4F6;
        }

        .pagination-arrow:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .pagination-button {
          border-radius: 4px;
          padding: 8px 12px;
          cursor: pointer;
          transition: background-color 0.2s;
          border: none;
          background: transparent;
        }

        .pagination-button.active {
          background-color: #3B82F6;
          color: #FFFFFF;
        }

        .pagination-button:not(.active):hover {
          background-color: #F3F4F6;
        }

        @media (max-width: 991px) {
          .contract-card {
            max-width: 100%;
          }

          .contract-header {
            max-width: 100%;
          }

          .contract-details {
            max-width: 100%;
          }

          .contract-footer {
            max-width: 100%;
          }

          .detail-item {
            padding-right: 20px;
          }
        }
      `}</style>
      
      <div className="contracts-list">
        {contracts.map((contract) => {
          const risk = getRiskLevel(contract.riskScore);
          
          return (
            <article 
              key={contract.id} 
              className="contract-card"
              onClick={() => alert(`Contract details: ${contract.contractTitle}`)}
            >
              {/* Contract Header */}
              <div className="contract-header">
                <div className="contract-company">
                  <div className="company-logo">
                    {contract.buyerName?.charAt(0) || 'C'}
                  </div>
                  <div className="company-info">
                    <h3 className="company-name">
                      {contract.buyerName || contract.contractTitle}
                    </h3>
                    <p className="contract-id">
                      Contract ID: {contract.id.slice(-8).toUpperCase()}
                    </p>
                  </div>
                </div>
                <div className="risk-badge">
                  <span className={risk.className}>
                    {risk.label}
                  </span>
                </div>
              </div>

              {/* Contract Details */}
              <div className="contract-details">
                <div className="detail-item">
                  <h4 className="detail-label">Contract Value</h4>
                  <p className="detail-value">
                    {formatCurrency(contract.contractValue)}
                  </p>
                </div>
                <div className="detail-item">
                  <h4 className="detail-label">Start Date</h4>
                  <p className="detail-value">
                    {formatDate(contract.startDate)}
                  </p>
                </div>
                <div className="detail-item">
                  <h4 className="detail-label">End Date</h4>
                  <p className="detail-value">
                    {formatDate(contract.endDate)}
                  </p>
                </div>
                <div className="detail-item">
                  <h4 className="detail-label">Status</h4>
                  <p className={`detail-value ${getStatusClassName(contract.status)}`}>
                    {getStatusLabel(contract.status)}
                  </p>
                </div>
              </div>

              {/* Contract Footer */}
              <div className="contract-footer">
                <p className="last-updated">
                  Last updated: {getTimeAgo(contract.createdAt)}
                </p>
                <div className="contract-actions">
                  View Details →
                </div>
              </div>
            </article>
          );
        })}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <nav className="pagination">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="pagination-arrow"
            >
              ←
            </button>
            
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`pagination-button ${pageNum === pagination.page ? 'active' : ''}`}
                >
                  {pageNum}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="pagination-arrow"
            >
              →
            </button>
          </nav>
        )}
      </div>
    </>
  );
}