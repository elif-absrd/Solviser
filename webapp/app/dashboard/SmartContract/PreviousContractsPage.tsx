"use client";
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, Download, Eye, AlertTriangle, CheckCircle, Clock, XCircle } from 'lucide-react';
import api from '@/lib/api';

interface PreviousContract {
  id: string;
  contractId: string;
  buyerName: string;
  buyerOrganization: string;
  contractValue: number;
  currency: string;
  startDate: string;
  latestShipmentDate: string;
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED' | 'AT_RISK';
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  lastUpdated: string;
  contractType: string;
}

interface PreviousContractsPageProps {
  onGoBack: () => void;
}

const PreviousContractsPage: React.FC<PreviousContractsPageProps> = ({ onGoBack }) => {
  const [contracts, setContracts] = useState<PreviousContract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<PreviousContract[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    fetchPreviousContracts();
  }, []);

  useEffect(() => {
    filterAndSortContracts();
  }, [contracts, searchTerm, statusFilter, riskFilter, sortBy, sortOrder]);

  const fetchPreviousContracts = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/contracts');
      console.log('API Response:', response.data); // Debug log
      
      // Handle different API response structures
      let contractsData = [];
      if (Array.isArray(response.data)) {
        contractsData = response.data;
      } else if (response.data && Array.isArray(response.data.data)) {
        contractsData = response.data.data;
      } else if (response.data && Array.isArray(response.data.contracts)) {
        contractsData = response.data.contracts;
      }
      
      setContracts(contractsData);
    } catch (error) {
      console.error('Failed to fetch previous contracts:', error);
      // Set mock data for development
      setContracts([
        {
          id: '1',
          contractId: 'IMP-2024-001',
          buyerName: 'Acme Trading Corp',
          buyerOrganization: 'Acme International',
          contractValue: 150000,
          currency: 'USD',
          startDate: '2024-01-15',
          latestShipmentDate: '2024-03-15',
          status: 'ACTIVE',
          riskLevel: 'LOW',
          lastUpdated: '2024-01-20',
          contractType: 'Import'
        },
        {
          id: '2',
          contractId: 'IMP-2024-002',
          buyerName: 'Global Imports Ltd',
          buyerOrganization: 'Global Trade Solutions',
          contractValue: 280000,
          currency: 'USD',
          startDate: '2024-02-01',
          latestShipmentDate: '2024-04-01',
          status: 'AT_RISK',
          riskLevel: 'HIGH',
          lastUpdated: '2024-02-10',
          contractType: 'Import'
        },
        {
          id: '3',
          contractId: 'IMP-2023-015',
          buyerName: 'Pacific Traders',
          buyerOrganization: 'Pacific Commerce Group',
          contractValue: 95000,
          currency: 'USD',
          startDate: '2023-11-15',
          latestShipmentDate: '2024-01-15',
          status: 'COMPLETED',
          riskLevel: 'LOW',
          lastUpdated: '2024-01-18',
          contractType: 'Import'
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterAndSortContracts = () => {
    // Ensure contracts is always an array
    const contractsArray = Array.isArray(contracts) ? contracts : [];
    
    let filtered = contractsArray.filter(contract => {
      const matchesSearch = 
        contract.contractId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.buyerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.buyerOrganization.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === '' || contract.status === statusFilter;
      const matchesRisk = riskFilter === '' || contract.riskLevel === riskFilter;
      
      return matchesSearch && matchesStatus && matchesRisk;
    });

    // Sort contracts
    filtered.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortBy) {
        case 'contractId':
          aValue = a.contractId;
          bValue = b.contractId;
          break;
        case 'buyerOrganization':
          aValue = a.buyerOrganization;
          bValue = b.buyerOrganization;
          break;
        case 'contractValue':
          aValue = a.contractValue;
          bValue = b.contractValue;
          break;
        case 'startDate':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'latestShipmentDate':
          aValue = new Date(a.latestShipmentDate);
          bValue = new Date(b.latestShipmentDate);
          break;
        case 'lastUpdated':
        default:
          aValue = new Date(a.lastUpdated);
          bValue = new Date(b.lastUpdated);
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredContracts(filtered);
  };

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'COMPLETED':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'AT_RISK':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'CANCELLED':
        return <XCircle className="w-4 h-4 text-gray-500" />;
      case 'DRAFT':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case 'LOW':
        return 'bg-green-100 text-green-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'CRITICAL':
        return 'bg-red-200 text-red-900';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-blue-100 text-blue-800';
      case 'AT_RISK':
        return 'bg-red-100 text-red-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading previous contracts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={onGoBack}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Dashboard</span>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Previous Contracts</h1>
              <p className="text-gray-600">View and manage your contract history</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              <Download className="w-4 h-4" />
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Statuses</option>
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="AT_RISK">At Risk</option>
              <option value="CANCELLED">Cancelled</option>
            </select>

            {/* Risk Filter */}
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">All Risk Levels</option>
              <option value="LOW">Low Risk</option>
              <option value="MEDIUM">Medium Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="CRITICAL">Critical Risk</option>
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="lastUpdated">Last Updated</option>
              <option value="contractId">Contract ID</option>
              <option value="buyerOrganization">Buyer Organization</option>
              <option value="contractValue">Contract Value</option>
              <option value="startDate">Start Date</option>
              <option value="latestShipmentDate">Shipment Date</option>
            </select>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing {filteredContracts.length} of {contracts.length} contracts
          </p>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('contractId')}
                  >
                    Contract ID
                    {sortBy === 'contractId' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('buyerOrganization')}
                  >
                    Buyer Organization
                    {sortBy === 'buyerOrganization' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Risk Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('contractValue')}
                  >
                    Contract Value
                    {sortBy === 'contractValue' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('startDate')}
                  >
                    Start Date
                    {sortBy === 'startDate' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('latestShipmentDate')}
                  >
                    Latest Shipment
                    {sortBy === 'latestShipmentDate' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => handleSort('lastUpdated')}
                  >
                    Last Updated
                    {sortBy === 'lastUpdated' && (
                      <span className="ml-1">{sortOrder === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContracts.map((contract) => (
                  <tr key={contract.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contract.contractId}</div>
                      <div className="text-sm text-gray-500">{contract.contractType}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{contract.buyerOrganization}</div>
                      <div className="text-sm text-gray-500">{contract.buyerName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRiskBadgeColor(contract.riskLevel)}`}>
                        {contract.riskLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(contract.contractValue, contract.currency)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(contract.startDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(contract.latestShipmentDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(contract.status)}
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(contract.status)}`}>
                          {contract.status.replace('_', ' ')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(contract.lastUpdated)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-red-600 hover:text-red-900 flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredContracts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No contracts found</h3>
            <p className="text-gray-600">
              {searchTerm || statusFilter || riskFilter 
                ? 'Try adjusting your filters to see more results.'
                : 'You haven\'t created any contracts yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PreviousContractsPage;