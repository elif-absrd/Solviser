import React, { useState } from "react";
import UploadDocumentModal from './UploadDocumentModal';
import NotifyBuyerModal from './NotifyBuyerModal';
import ReportDisputeModal from './ReportDisputeModal';
import api from '../../../lib/api';

interface QuickActionsProps {
  onNewContract: () => void;
  onImportContract: () => void;
  onTemplateLibrary: () => void;
  onContractBuilder: () => void;
}

<<<<<<< HEAD
export default function QuickActions({ onNewContract, onImportContract, onTemplateLibrary, onContractBuilder }: QuickActionsProps) {
  const actionsRow1 = [
    {
      id: "templateLibrary",
      title: "Browse Template Library",
      icon: "�",
      onClick: onTemplateLibrary
    },
    {
      id: "contractBuilder",
      title: "Contract Builder",
      icon: "🏗️",
      onClick: onContractBuilder
    },
    {
      id: "newContract",
      title: "New Smart Contract",
      icon: "📄",
      onClick: onNewContract
    },
    {
      id: "importContract",
      title: "Import Smart Contract",
      icon: "📋",
      onClick: onImportContract
    },
    {
      id: "uploadContract", 
      title: "Upload Contract Document",
      icon: "📁",
      onClick: () => alert("Upload contract feature coming soon!")
    }
  ];

  const actionsRow2 = [
    {
      id: "viewRiskReport",
      title: "View Risk Report", 
      icon: "�",
      onClick: () => alert("Risk report feature coming soon!")
    },
    {
      id: "downloadReport",
      title: "Download All Contracts Report",
      icon: "�", 
      onClick: () => alert("Download report feature coming soon!")
    },
    {
      id: "notifyBuyer",
      title: "Notify Buyer",
      icon: "🔔",
      onClick: () => alert("Notify buyer feature coming soon!")
    },
    {
      id: "renewContract",
      title: "Renew Contract", 
      icon: "🔄",
      onClick: () => alert("Contract renewal feature coming soon!")
    },
    {
      id: "exportAnalytics",
      title: "Export Contract Analytics",
      icon: "📈",
      onClick: () => alert("Analytics export feature coming soon!")
=======
const QuickActions: React.FC<QuickActionsProps> = ({ onNewContract, onImportContract }) => {
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [notifyModalOpen, setNotifyModalOpen] = useState(false);
  const [disputeModalOpen, setDisputeModalOpen] = useState(false);

  const handleDownloadBuyerReport = async () => {
    try {
      const response = await api.get('/contracts/reports/buyers', {
        responseType: 'blob'
      });
      
      // Create blob link to download
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
>>>>>>> d1168c7 (kopal changes)
    }
  };

  const handleSuccess = () => {
    // Show success message or refresh data
    alert('Action completed successfully!');
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-red-500 rounded-lg">
        <button
          onClick={onNewContract}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">📄</div>
          <div className="text-sm">New Smart Contract</div>
        </button>
        
        <button
          onClick={onImportContract}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">📋</div>
          <div className="text-sm">Import Smart Contract</div>
        </button>
        
        <button
          onClick={() => setUploadModalOpen(true)}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">📤</div>
          <div className="text-sm">Upload Contract Document</div>
        </button>
        
        <button
          onClick={() => alert("Risk report functionality coming soon!")}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">📊</div>
          <div className="text-sm">View Risk Report</div>
        </button>
        
        <button
          onClick={handleDownloadBuyerReport}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">📥</div>
          <div className="text-sm">Download All Contract Buyer</div>
        </button>
        
        <button
          onClick={() => setNotifyModalOpen(true)}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">🔔</div>
          <div className="text-sm">Notify Buyer</div>
        </button>
        
        <button
          onClick={() => alert("Renewal functionality coming soon!")}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">🔄</div>
          <div className="text-sm">Renew Contract</div>
        </button>
        
        <button
          onClick={() => setDisputeModalOpen(true)}
          className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-4 rounded-lg text-center transition-all"
        >
          <div className="text-2xl mb-2">⚠️</div>
          <div className="text-sm">Report Dispute</div>
        </button>
      </div>

      {/* Modals */}
      <UploadDocumentModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        contractId="default" // This should be passed from parent or selected contract
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
