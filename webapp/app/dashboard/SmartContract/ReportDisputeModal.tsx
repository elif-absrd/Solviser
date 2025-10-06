import React, { useState } from 'react';
import api from '../../../lib/api';

interface ReportDisputeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ReportDisputeModal: React.FC<ReportDisputeModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState({
    contractId: '',
    buyerGstNumber: '',
    disputeReason: '',
    description: ''
  });
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    setEvidenceFiles(selectedFiles);
  };

  const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
    const promises = files.map(file => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64 = reader.result as string;
          resolve(base64);
        };
        reader.onerror = error => reject(error);
      });
    });
    
    return Promise.all(promises);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.buyerGstNumber || !formData.disputeReason || !formData.description) {
      setError('GST number, dispute reason, and description are required');
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      let evidenceBase64: string[] = [];
      if (evidenceFiles.length > 0) {
        evidenceBase64 = await convertFilesToBase64(evidenceFiles);
      }

      await api.post('/contracts/report-dispute', {
        ...formData,
        evidenceFiles: evidenceBase64
      });
      
      onSuccess();
      onClose();
      // Reset form
      setFormData({
        contractId: '',
        buyerGstNumber: '',
        disputeReason: '',
        description: ''
      });
      setEvidenceFiles([]);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to report dispute');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg max-h-screen overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">Report Dispute</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contract ID (Optional)
            </label>
            <input
              type="text"
              name="contractId"
              value={formData.contractId}
              onChange={handleInputChange}
              placeholder="Enter contract ID"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Buyer GST Number *
            </label>
            <input
              type="text"
              name="buyerGstNumber"
              value={formData.buyerGstNumber}
              onChange={handleInputChange}
              placeholder="Enter buyer's GST number"
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dispute Reason *
            </label>
            <select
              name="disputeReason"
              value={formData.disputeReason}
              onChange={handleInputChange}
              required
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select dispute reason</option>
              <option value="payment_delay">Payment Delay</option>
              <option value="quality_issue">Quality Issue</option>
              <option value="breach_of_contract">Breach of Contract</option>
              <option value="delivery_delay">Delivery Delay</option>
              <option value="non_compliance">Non-Compliance</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Provide detailed explanation of the dispute"
              required
              rows={4}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Evidence Files (Optional)
            </label>
            <input
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              onChange={handleFileSelect}
              className="w-full p-2 border border-gray-300 rounded"
            />
            <p className="text-xs text-gray-500 mt-1">
              Upload supporting documents (PDF, images, or documents)
            </p>
          </div>

          {evidenceFiles.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Files:</h4>
              {evidenceFiles.map((file, index) => (
                <div key={index} className="text-sm text-gray-600 bg-gray-100 p-2 rounded mb-1">
                  {file.name} ({(file.size / 1024).toFixed(1)} KB)
                </div>
              ))}
            </div>
          )}

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Report Dispute'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReportDisputeModal;