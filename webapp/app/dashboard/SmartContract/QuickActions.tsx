"use client";

import React, { useState } from "react";
import UploadDocumentModal from './UploadDocumentModal';
import NotifyBuyerModal from './NotifyBuyerModal';
import ReportDisputeModal from './ReportDisputeModal';
import api from '../../../lib/api';

interface QuickActionsProps {
  onImportContract: () => void;
  onTemplateLibrary: () => void;
  onContractBuilder: () => void;
  onPreviousContracts: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onImportContract, 
  onTemplateLibrary, 
  onContractBuilder,
  onPreviousContracts
}) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const handleDownloadBuyerReport = async () => {
    try {
      const response = await api.get('/contracts/reports/buyers', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contract-buyer-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert('Failed to download report: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleExportAnalytics = async () => {
    try {
      const response = await api.get('/contracts/analytics/export', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contract-analytics-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert('Failed to export analytics: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleViewRiskReport = async () => {
    try {
      const response = await api.get('/contracts/risk-analysis', {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'contract-risk-report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      alert('Failed to view risk report: ' + (error.response?.data?.error || error.message));
    }
  };

  const handleRenewContract = () => {
    alert("Contract renewal functionality will be available soon!");
  };

  const handleSuccess = () => {
    alert('Action completed successfully!');
  };

  const actionsRow1 = [
    {
      id: "templateLibrary",
      title: "Browse Template Library",
      icon: "📚",
      onClick: onTemplateLibrary
    },
    {
      id: "contractBuilder", 
      title: "Contract Builder",
      icon: "🏗️",
      onClick: onContractBuilder
    },
    {
      id: "importContract",
      title: "Import Smart Contract", 
      icon: "📋",
      onClick: onImportContract
    },
    {
      id: "previousContracts",
      title: "Previous Contracts",
      icon: "📜",
      onClick: onPreviousContracts
    }
  ];

  const actionsRow2 = [
    {
      id: "viewRiskReport",
      title: "View Risk Report",
      icon: "📊",
      onClick: handleViewRiskReport
    },
    {
      id: "notifyBuyer",
      title: "Notify Buyer",
      icon: "🔔",
      onClick: () => setNotifyModalOpen(true)
    },
    {
      id: "renewContract",
      title: "Renew Contract",
      icon: "🔄", 
      onClick: handleRenewContract
    },
    {
      id: "exportAnalytics",
      title: "Export Contract Analytics",
      icon: "📈",
      onClick: handleExportAnalytics
    }
  ];

  return (
    <>
      <style jsx>{`
        .action-buttons-container {
          border-radius: 8px;
          background-color: #F05134;
          box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          align-items: stretch;
          width: 100%;
          padding: 24px;
        }

        @media (max-width: 991px) {
          .action-buttons-container {
            max-width: 100%;
            padding: 16px;
          }
        }

        .action-buttons-row {
          display: flex;
          align-items: stretch;
          gap: 20px;
          justify-content: space-between;
        }

        .action-buttons-row + .action-buttons-row {
          margin-top: 20px;
        }

        .action-button {
          border-radius: 8px;
          background-color: #FFFFFF;
          box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
          border: 1px solid #E5E7EB;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 24px 16px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: center;
        }

        .action-button:hover {
          transform: translateY(-2px);
          box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.12);
        }

        .action-icon {
          font-size: 32px;
          margin-bottom: 12px;
          display: block;
        }

        .action-text {
          color: #374151;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
        }

        @media (max-width: 991px) {
          .action-buttons-row {
            flex-direction: column;
            gap: 12px;
          }
          
          .action-button {
            padding: 20px 12px;
          }

          .action-icon {
            font-size: 28px;
            margin-bottom: 8px;
          }

          .action-text {
            font-size: 13px;
          }
        }

        @media (max-width: 640px) {
          .action-buttons-row {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>
      
      <div className="action-buttons-container">
        {/* First Row */}
        <div className="action-buttons-row">
          {actionsRow1.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="action-button"
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-text">{action.title}</span>
            </button>
          ))}
        </div>

        {/* Second Row */}
        <div className="action-buttons-row">
          {actionsRow2.map((action) => (
            <button
              key={action.id}
              onClick={action.onClick}
              className="action-button"
            >
              <span className="action-icon">{action.icon}</span>
              <span className="action-text">{action.title}</span>
            </button>
          ))}
        </div>
      </div>

      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        contractId="default"
        onSuccess={handleSuccess}
      />

      <NotifyBuyerModal
        isOpen={notifyModalOpen}
        onClose={() => setNotifyModalOpen(false)}
        onSuccess={handleSuccess}
      />

      <ReportDisputeModal
        isOpen={disputeModalOpen}
        onClose={() => setDisputeModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default QuickActions;
