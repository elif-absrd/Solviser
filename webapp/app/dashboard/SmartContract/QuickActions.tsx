"use client";

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

const QuickActions: React.FC<QuickActionsProps> = ({ 
  onNewContract, 
  onImportContract, 
  onTemplateLibrary, 
  onContractBuilder 
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

  return (
    <>
      <div className="p-6 bg-red-500 rounded-lg">
        {/* First Row */}
        <div className="grid grid-cols-5 gap-4 mb-4">
          <button
            onClick={onNewContract}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V8z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm font-medium">New Smart Contract</div>
          </button>
          
          <button
            onClick={() => setUploadModalOpen(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm font-medium">Upload Contract Document</div>
          </button>
          
          <button
            onClick={handleViewRiskReport}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <div className="text-sm font-medium">View Risk Report</div>
          </button>
          
          <button
            onClick={handleDownloadBuyerReport}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm font-medium">Download All Contracts Report</div>
          </button>
          
          <button
            onClick={() => setNotifyModalOpen(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <div className="text-sm font-medium">Notify Buyer</div>
          </button>
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-3 gap-4">
          <button
            onClick={handleRenewContract}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm font-medium">Renew Contract</div>
          </button>
          
          <button
            onClick={() => setDisputeModalOpen(true)}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm font-medium">Report Dispute</div>
          </button>
          
          <button
            onClick={handleExportAnalytics}
            className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white p-6 rounded-lg text-center transition-all flex flex-col items-center"
          >
            <div className="text-3xl mb-3">
              <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            <div className="text-sm font-medium">Export Contract Analytics</div>
          </button>
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
