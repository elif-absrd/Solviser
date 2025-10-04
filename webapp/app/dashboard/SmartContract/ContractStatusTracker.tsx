'use client';

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Send, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Eye,
  Download,
  Hash,
  Shield,
  Users,
  Calendar,
  Activity
} from 'lucide-react';

interface ContractStatus {
  id: string;
  contractId: string;
  title: string;
  status: 'draft' | 'sent' | 'signed' | 'declined' | 'active' | 'completed' | 'terminated';
  parties: {
    sender: { name: string; email: string; gstin?: string };
    receiver: { name: string; email: string; gstin?: string };
  };
  timeline: ContractTimelineEvent[];
  digitalSignatures: DigitalSignature[];
  immutableHash: string;
  versionHistory: ContractVersion[];
  eStampStatus?: 'pending' | 'applied' | 'not_required';
  value: number;
  currency: string;
  createdAt: string;
  lastUpdated: string;
  expiryDate?: string;
  attachments: ContractAttachment[];
}

interface ContractTimelineEvent {
  id: string;
  type: 'created' | 'sent' | 'viewed' | 'signed' | 'declined' | 'modified' | 'reminder_sent' | 'expired';
  description: string;
  timestamp: string;
  userId: string;
  userName: string;
  metadata?: any;
}

interface DigitalSignature {
  id: string;
  signerId: string;
  signerName: string;
  signerEmail: string;
  signatureMethod: 'aadhaar_otp' | 'dsc' | 'esign';
  signedAt: string;
  ipAddress: string;
  deviceInfo: string;
  documentHash: string;
  isValid: boolean;
}

interface ContractVersion {
  id: string;
  version: string;
  changes: string[];
  createdAt: string;
  createdBy: string;
  documentHash: string;
}

interface ContractAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  hash: string;
}

interface ContractStatusTrackerProps {
  contractId: string;
  onGoBack: () => void;
}

export default function ContractStatusTracker({ contractId, onGoBack }: ContractStatusTrackerProps) {
  const [contract, setContract] = useState<ContractStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'signatures' | 'versions' | 'audit'>('overview');

  // Mock data for demonstration
  const mockContract: ContractStatus = {
    id: 'contract_001',
    contractId: 'IMP-2025-0001',
    title: 'Import Agreement - Pine Wood Supply',
    status: 'signed',
    parties: {
      sender: {
        name: 'ABC Enterprises',
        email: 'contracts@abcenterprises.com',
        gstin: '27AAACA0442L1ZP'
      },
      receiver: {
        name: 'XYZ Traders',
        email: 'legal@xyztraders.com',
        gstin: '07AABCU9603R1ZX'
      }
    },
    timeline: [
      {
        id: 'event_001',
        type: 'created',
        description: 'Contract draft created',
        timestamp: '2025-10-01T10:00:00Z',
        userId: 'user_001',
        userName: 'Rajesh Kumar'
      },
      {
        id: 'event_002',
        type: 'sent',
        description: 'Contract sent to XYZ Traders for review',
        timestamp: '2025-10-01T14:30:00Z',
        userId: 'user_001',
        userName: 'Rajesh Kumar'
      },
      {
        id: 'event_003',
        type: 'viewed',
        description: 'Contract viewed by recipient',
        timestamp: '2025-10-02T09:15:00Z',
        userId: 'user_002',
        userName: 'Priya Sharma'
      },
      {
        id: 'event_004',
        type: 'signed',
        description: 'Contract digitally signed by both parties',
        timestamp: '2025-10-02T16:45:00Z',
        userId: 'user_002',
        userName: 'Priya Sharma'
      }
    ],
    digitalSignatures: [
      {
        id: 'sig_001',
        signerId: 'user_001',
        signerName: 'Rajesh Kumar',
        signerEmail: 'rajesh@abcenterprises.com',
        signatureMethod: 'aadhaar_otp',
        signedAt: '2025-10-02T16:30:00Z',
        ipAddress: '192.168.1.100',
        deviceInfo: 'Chrome 119.0 on Windows 11',
        documentHash: 'sha256:a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2',
        isValid: true
      },
      {
        id: 'sig_002',
        signerId: 'user_002',
        signerName: 'Priya Sharma',
        signerEmail: 'priya@xyztraders.com',
        signatureMethod: 'dsc',
        signedAt: '2025-10-02T16:45:00Z',
        ipAddress: '203.0.113.45',
        deviceInfo: 'Firefox 118.0 on macOS 14',
        documentHash: 'sha256:a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2',
        isValid: true
      }
    ],
    immutableHash: 'sha256:a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2q3r4s5t6u7v8',
    versionHistory: [
      {
        id: 'ver_001',
        version: '1.0',
        changes: ['Initial draft created'],
        createdAt: '2025-10-01T10:00:00Z',
        createdBy: 'Rajesh Kumar',
        documentHash: 'sha256:b1c2d3e4f5g6h7i8j9k0l1m2n3o4p5q6'
      },
      {
        id: 'ver_002',
        version: '1.1',
        changes: ['Updated payment terms', 'Added penalty clause'],
        createdAt: '2025-10-01T12:30:00Z',
        createdBy: 'Rajesh Kumar',
        documentHash: 'sha256:a7b8c9d0e1f2g3h4i5j6k7l8m9n0o1p2'
      }
    ],
    eStampStatus: 'applied',
    value: 500000,
    currency: 'INR',
    createdAt: '2025-10-01T10:00:00Z',
    lastUpdated: '2025-10-02T16:45:00Z',
    expiryDate: '2025-12-31T23:59:59Z',
    attachments: [
      {
        id: 'att_001',
        name: 'Import_License.pdf',
        type: 'application/pdf',
        size: 1024000,
        uploadedAt: '2025-10-01T11:00:00Z',
        hash: 'sha256:c1d2e3f4g5h6i7j8k9l0m1n2o3p4q5r6'
      }
    ]
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setContract(mockContract);
      setLoading(false);
    }, 1000);
  }, [contractId]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'signed': return 'bg-green-100 text-green-800';
      case 'declined': return 'bg-red-100 text-red-800';
      case 'active': return 'bg-emerald-100 text-emerald-800';
      case 'completed': return 'bg-purple-100 text-purple-800';
      case 'terminated': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft': return <FileText className="h-4 w-4" />;
      case 'sent': return <Send className="h-4 w-4" />;
      case 'signed': return <CheckCircle className="h-4 w-4" />;
      case 'declined': return <XCircle className="h-4 w-4" />;
      case 'active': return <Activity className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'terminated': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Byte';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Contract not found</h3>
          <p className="text-gray-500">The requested contract could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <img 
            src="/blacklogo.png" 
            alt="Solviser Logo" 
            className="h-10 w-auto mr-6"
          />
          <button 
            onClick={onGoBack} 
            className="px-4 py-2.5 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors mr-4"
          >
            ← Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{contract.title}</h1>
            <p className="text-gray-500">Contract ID: {contract.contractId}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(contract.status)}`}>
            {getStatusIcon(contract.status)}
            {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
          </span>
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center space-x-2"
          >
            <Eye className="h-4 w-4" />
            <span>Preview</span>
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Download</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'Overview', icon: Eye },
              { id: 'timeline', name: 'Timeline', icon: Clock },
              { id: 'signatures', name: 'Signatures', icon: Shield },
              { id: 'versions', name: 'Versions', icon: Activity },
              { id: 'audit', name: 'Audit Trail', icon: Hash }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Contract Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Sender
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {contract.parties.sender.name}</p>
                    <p><span className="font-medium">Email:</span> {contract.parties.sender.email}</p>
                    {contract.parties.sender.gstin && (
                      <p><span className="font-medium">GSTIN:</span> {contract.parties.sender.gstin}</p>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    Receiver
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {contract.parties.receiver.name}</p>
                    <p><span className="font-medium">Email:</span> {contract.parties.receiver.email}</p>
                    {contract.parties.receiver.gstin && (
                      <p><span className="font-medium">GSTIN:</span> {contract.parties.receiver.gstin}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Contract Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-900 mb-4 flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Contract Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="font-medium text-gray-700">Value</p>
                    <p className="text-gray-900">{formatCurrency(contract.value, contract.currency)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Created</p>
                    <p className="text-gray-900">{formatDate(contract.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Last Updated</p>
                    <p className="text-gray-900">{formatDate(contract.lastUpdated)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">e-Stamp Status</p>
                    <p className="text-gray-900 capitalize">{contract.eStampStatus?.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Expiry Date</p>
                    <p className="text-gray-900">{contract.expiryDate ? formatDate(contract.expiryDate) : 'N/A'}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-700">Immutable Hash</p>
                    <p className="text-gray-900 font-mono text-xs">{contract.immutableHash.substring(0, 20)}...</p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {contract.attachments.length > 0 && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-4">Attachments</h3>
                  <div className="space-y-2">
                    {contract.attachments.map(attachment => (
                      <div key={attachment.id} className="flex items-center justify-between p-3 bg-white rounded border">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{attachment.name}</p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.size)} • {formatDate(attachment.uploadedAt)}
                            </p>
                          </div>
                        </div>
                        <button className="text-red-600 hover:text-red-800 text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Timeline Tab */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              {contract.timeline.map((event, index) => (
                <div key={event.id} className="flex items-start space-x-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    index === 0 ? 'bg-red-100' : 'bg-gray-100'
                  }`}>
                    {getStatusIcon(event.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">{event.description}</h4>
                      <time className="text-xs text-gray-500">{formatDate(event.timestamp)}</time>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">by {event.userName}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Signatures Tab */}
          {activeTab === 'signatures' && (
            <div className="space-y-4">
              {contract.digitalSignatures.map(signature => (
                <div key={signature.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">{signature.signerName}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      signature.isValid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {signature.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="font-medium text-gray-700">Email</p>
                      <p className="text-gray-900">{signature.signerEmail}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Method</p>
                      <p className="text-gray-900 capitalize">{signature.signatureMethod.replace('_', ' ')}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">Signed At</p>
                      <p className="text-gray-900">{formatDate(signature.signedAt)}</p>
                    </div>
                    <div>
                      <p className="font-medium text-gray-700">IP Address</p>
                      <p className="text-gray-900">{signature.ipAddress}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-medium text-gray-700">Device Info</p>
                      <p className="text-gray-900">{signature.deviceInfo}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="font-medium text-gray-700">Document Hash</p>
                      <p className="text-gray-900 font-mono text-xs">{signature.documentHash}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Versions Tab */}
          {activeTab === 'versions' && (
            <div className="space-y-4">
              {contract.versionHistory.map((version, index) => (
                <div key={version.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Version {version.version}</h4>
                    <span className="text-xs text-gray-500">{formatDate(version.createdAt)}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">Created by {version.createdBy}</p>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-700">Changes:</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                      {version.changes.map((change, idx) => (
                        <li key={idx}>{change}</li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-gray-500 mt-3 font-mono">Hash: {version.documentHash}</p>
                </div>
              ))}
            </div>
          )}

          {/* Audit Trail Tab */}
          {activeTab === 'audit' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-4">
                <Shield className="h-5 w-5 text-green-600" />
                <h3 className="font-medium text-gray-900">Tamper-Evident Audit Trail</h3>
              </div>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700">Immutable Hash</p>
                  <p className="text-gray-900 font-mono break-all">{contract.immutableHash}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Blockchain Timestamp</p>
                  <p className="text-gray-900">{formatDate(contract.lastUpdated)}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Digital Signatures Verified</p>
                  <p className="text-green-600">✓ All signatures verified and valid</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Document Integrity</p>
                  <p className="text-green-600">✓ Document has not been tampered with</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700">Audit Evidence Chain</p>
                  <p className="text-green-600">✓ Complete evidence chain maintained</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}