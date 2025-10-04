"use client";
import React, { useState, useEffect } from "react";
import AddNewContractPage from "./AddNewContractPage";
import ImportContractPage from "./ImportContractPage";
import ContractList from "./ContractList";
import ContractFilters from "./ContractFilters";
import QuickActions from "./QuickActions";
import ContractInsights from "./ContractInsights";
import UpcomingMilestones from "./UpcomingMilestones";
import StatCard from "./StatCard";
import TemplateLibrary from "./TemplateLibrary";
import ContractBuilder from "./ContractBuilder";
import ContractStatusTracker from "./ContractStatusTracker";
import { DocumentIcon, CheckIcon, AlertCircleIcon, HandshakeIcon, ClockIcon } from "./icons";
import api from '@/lib/api';
import { RotateCcw } from "lucide-react";

interface ContractStats {
  activeContracts: { count: number; trend: any };
  completedContracts: { count: number; trend: any };
  contractsAtRisk: { count: number; trend: any };
  defaultedContracts: { count: number; trend: any };
  inRenewal: { count: number; trend: any };
  totalValue: number;
}

interface ContractFilters {
  buyer: string;
  industry: string;
  status: string;
  sortBy: string;
}

type ViewType = "dashboard" | "newContract" | "importContract" | "templateLibrary" | "contractBuilder" | "statusTracker";


export default function SmartContractPage() {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [selectedContractId, setSelectedContractId] = useState<string>("");
  const [filters, setFilters] = useState<ContractFilters>({
    buyer: '',
    industry: '',
    status: '',
    sortBy: 'riskScore'
  });


  const fetchStats = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) {
        setIsRefreshing(true);
      } else if (!stats) {
        setIsLoading(true);
      }
      
      const response = await api.get('/contracts/stats');
      setStats(response.data);
      setError(null); // Clear any previous errors
    } catch (err: any) {
      console.error('Failed to fetch contract stats:', err);
      setError('Failed to load contract statistics');
      // Set default stats if API fails
      if (!stats) {
        setStats({
          activeContracts: { count: 0, trend: { direction: 'neutral', text: 'No data available' } },
          completedContracts: { count: 0, trend: { direction: 'neutral', text: 'No data available' } },
          contractsAtRisk: { count: 0, trend: { direction: 'neutral', text: 'No data available' } },
          defaultedContracts: { count: 0, trend: { direction: 'neutral', text: 'No data available' } },
          inRenewal: { count: 0, trend: { direction: 'neutral', text: 'No data available' } },
          totalValue: 0
        });
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Fetch contract stats
  useEffect(() => {
    fetchStats();
    
    // Refresh stats every 5 minutes
    const interval = setInterval(() => fetchStats(), 300000);
    
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (newFilters: Partial<ContractFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const clearFilters = () => {
    setFilters({
      buyer: '',
      industry: '',
      status: '',
      sortBy: 'riskScore'
    });
  };

  const handleTemplateLibrary = () => setCurrentView("templateLibrary");
  const handleContractBuilder = (template?: any) => {
    setSelectedTemplate(template);
    setCurrentView("contractBuilder");
  };
  const handleStatusTracker = (contractId: string) => {
    setSelectedContractId(contractId);
    setCurrentView("statusTracker");
  };

  if (currentView === "newContract") {
    return <AddNewContractPage onGoBack={() => {
      setCurrentView("dashboard");
      // Refresh stats when returning from new contract page
      fetchStats(true);
    }} />;
  }

  if (currentView === "importContract") {
    return <ImportContractPage onGoBack={() => {
      setCurrentView("dashboard");
      // Refresh stats when returning from import contract page
      fetchStats(true);
    }} />;
  }

  if (currentView === "templateLibrary") {
    return <TemplateLibrary 
      onSelectTemplate={(template) => handleContractBuilder(template)}
      onGoBack={() => setCurrentView("dashboard")}
    />;
  }

  if (currentView === "contractBuilder") {
    return <ContractBuilder 
      template={selectedTemplate}
      onSave={(contract) => {
        console.log('Contract saved:', contract);
        setCurrentView("dashboard");
        fetchStats(true);
      }}
      onGoBack={() => setCurrentView("dashboard")}
    />;
  }

  if (currentView === "statusTracker") {
    return <ContractStatusTracker 
      contractId={selectedContractId}
      onGoBack={() => setCurrentView("dashboard")}
    />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <RotateCcw className="w-8 h-8 text-red-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="dashboard-frame">
      <div className="dashboard-body">
        <div className="dashboard-container">

          <div className="main-content-wrapper">
            <main className="main-content">
              {/* Page Header */}
              <section className="page-header">
                <div className="page-title-container">
                  <h1 className="page-title">Smart Contract Management</h1>
                  <p className="page-description">
                    Create, manage, track, and analyze smart B2B contracts with AI-enabled risk assessment
                  </p>
                </div>
                <div className="header-actions">
                  <button 
                    className="refresh-button"
                    onClick={() => fetchStats(true)}
                    disabled={isRefreshing}
                    title="Refresh Statistics"
                  >
                    <RotateCcw className={`refresh-icon ${isRefreshing ? 'spinning' : ''}`} />
                  </button>
                  <div className="contract-type-buttons">
                    <button 
                      className="primary-button"
                      onClick={() => setCurrentView("templateLibrary")}
                    >
                      <div className="button-icon">📚</div>
                      <span className="button-text">Template Library</span>
                    </button>
                    <button 
                      className="secondary-button"
                      onClick={() => handleContractBuilder()}
                    >
                      <div className="button-icon">🏗️</div>
                      <span className="button-text">Contract Builder</span>
                    </button>
                    <button 
                      className="primary-button"
                      onClick={() => setCurrentView("newContract")}
                    >
                      <div className="button-icon">+</div>
                      <span className="button-text">New Smart Contract</span>
                    </button>
                    <button 
                      className="secondary-button"
                      onClick={() => setCurrentView("importContract")}
                    >
                      <div className="button-icon">📋</div>
                      <span className="button-text">Import Contract</span>
                    </button>
                  </div>
                </div>
              </section>

              {/* Stats Cards */}
              <section className="stats-cards">
                <div className="stat-card">
                  <h3 className="stat-title">Active Contracts</h3>
                  <div className="stat-value-container">
                    <div className="stat-icon-container">
                      <DocumentIcon className="stat-icon" />
                    </div>
                    <span className="stat-value">{stats?.activeContracts.count || 0}</span>
                  </div>
                  <div className={`stat-trend ${stats?.activeContracts.trend?.direction === 'up' ? 'positive' : stats?.activeContracts.trend?.direction === 'down' ? 'negative' : 'info'}`} suppressHydrationWarning>
                    <div className="trend-icon-container">
                      <div className="trend-icon">{stats?.activeContracts.trend?.direction === 'up' ? '↗' : stats?.activeContracts.trend?.direction === 'down' ? '↓' : '→'}</div>
                    </div>
                    <span className="trend-text">{stats?.activeContracts.trend?.text || "No data"}</span>
                  </div>
                  <p className="stat-subtitle">Currently active agreements</p>
                </div>

                <div className="stat-card">
                  <h3 className="stat-title">Completed Contracts</h3>
                  <div className="stat-value-container">
                    <div className="stat-icon-container">
                      <CheckIcon className="stat-icon" />
                    </div>
                    <span className="stat-value">{stats?.completedContracts.count || 0}</span>
                  </div>
                  <div className={`stat-trend ${stats?.completedContracts.trend?.direction === 'up' ? 'positive' : stats?.completedContracts.trend?.direction === 'down' ? 'negative' : 'info'}`} suppressHydrationWarning>
                    <div className="trend-icon-container">
                      <div className="trend-icon">{stats?.completedContracts.trend?.direction === 'up' ? '↗' : stats?.completedContracts.trend?.direction === 'down' ? '↓' : '✓'}</div>
                    </div>
                    <span className="trend-text">{stats?.completedContracts.trend?.text || "No data"}</span>
                  </div>
                  <p className="stat-subtitle">Successfully completed</p>
                </div>

                <div className="stat-card">
                  <h3 className="stat-title">Contracts at Risk</h3>
                  <div className="stat-value-container">
                    <div className="stat-icon-container">
                      <AlertCircleIcon className="stat-icon" />
                    </div>
                    <span className="stat-value">{stats?.contractsAtRisk.count || 0}</span>
                  </div>
                  <div className={`stat-trend ${stats?.contractsAtRisk.trend?.direction === 'up' ? 'negative' : stats?.contractsAtRisk.trend?.direction === 'down' ? 'positive' : 'warning'}`} suppressHydrationWarning>
                    <div className="trend-icon-container">
                      <div className="trend-icon">{stats?.contractsAtRisk.trend?.direction === 'up' ? '↗' : stats?.contractsAtRisk.trend?.direction === 'down' ? '↓' : '⚠'}</div>
                    </div>
                    <span className="trend-text">{stats?.contractsAtRisk.trend?.text || "No data"}</span>
                  </div>
                  <p className="stat-subtitle">Require attention</p>
                </div>

                <div className="stat-card">
                  <h3 className="stat-title">Defaulted Contracts</h3>
                  <div className="stat-value-container">
                    <div className="stat-icon-container">
                      <HandshakeIcon className="stat-icon" />
                    </div>
                    <span className="stat-value">{stats?.defaultedContracts.count || 0}</span>
                  </div>
                  <div className={`stat-trend ${stats?.defaultedContracts.trend?.direction === 'up' ? 'negative' : stats?.defaultedContracts.trend?.direction === 'down' ? 'positive' : 'warning'}`} suppressHydrationWarning>
                    <div className="trend-icon-container">
                      <div className="trend-icon">{stats?.defaultedContracts.trend?.direction === 'up' ? '↗' : stats?.defaultedContracts.trend?.direction === 'down' ? '↓' : '⚠'}</div>
                    </div>
                    <span className="trend-text">{stats?.defaultedContracts.trend?.text || "No data"}</span>
                  </div>
                  <p className="stat-subtitle">Failed agreements</p>
                </div>

                <div className="stat-card">
                  <h3 className="stat-title">In Renewal</h3>
                  <div className="stat-value-container">
                    <div className="stat-icon-container">
                      <ClockIcon className="stat-icon" />
                    </div>
                    <span className="stat-value">{stats?.inRenewal.count || 0}</span>
                  </div>
                  <div className={`stat-trend ${stats?.inRenewal.trend?.direction === 'up' ? 'positive' : stats?.inRenewal.trend?.direction === 'down' ? 'negative' : 'info'}`} suppressHydrationWarning>
                    <div className="trend-icon-container">
                      <div className="trend-icon">{stats?.inRenewal.trend?.direction === 'up' ? '↗' : stats?.inRenewal.trend?.direction === 'down' ? '↓' : '🔄'}</div>
                    </div>
                    <span className="trend-text">{stats?.inRenewal.trend?.text || "No data"}</span>
                  </div>
                  <p className="stat-subtitle">Renewal process</p>
                </div>
              </section>

              {/* Quick Action Center */}
              <section className="quick-action-center">
                <h2 className="section-title">Quick Action Center</h2>
                <QuickActions 
                  onNewContract={() => setCurrentView("newContract")} 
                  onImportContract={() => setCurrentView("importContract")}
                  onTemplateLibrary={() => setCurrentView("templateLibrary")}
                  onContractBuilder={() => handleContractBuilder()}
                />
              </section>

              {/* Contracts Section */}
              <section className="contracts-section">
                <div className="contracts-layout">
                  {/* Left Column - Contracts List (66%) */}
                  <div className="contracts-column">
                    <div className="contracts-container">
                      <div className="filter-container">
                        <ContractFilters 
                          filters={filters} 
                          onFilterChange={handleFilterChange} 
                          onClearFilters={clearFilters} 
                        />
                      </div>
                      <ContractList 
                        filters={filters} 
                        onStatusTracker={(contractId) => handleStatusTracker(contractId)}
                      />
                    </div>
                  </div>

                  {/* Right Column - Sidebar (34%) */}
                  <div className="sidebar-column">
                    <ContractInsights />
                    <UpcomingMilestones />
                  </div>
                </div>
              </section>
            </main>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Base styles and reset */
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        /* Dashboard frame and container */
        .dashboard-frame {
          background-color: #FAFAFA;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .dashboard-body {
          width: 100%;
        }

        @media (max-width: 991px) {
          .dashboard_body {
            max-width: 100%;
          }
        }

        .dashboard-container {
          gap: 0px;
          display: flex;
          flex-direction: column;
          padding: 0px 32px;
        }

        @media (max-width: 991px) {
          .dashboard-container {
            padding: 0 20px;
          }
        }

        /* Header styles */
        .main-header {
          border-bottom: 1px solid #E5E7EB;
          background-color: #FFFFFF;
          display: flex;
          width: 100%;
          padding: 20px 0;
          align-items: stretch;
          gap: 20px;
          justify-content: space-between;
        }

        @media (max-width: 991px) {
          .main-header {
            max-width: 100%;
            padding: 16px 0;
          }
        }

        .header-content {
          display: flex;
          width: 100%;
          align-items: stretch;
          gap: 20px;
          justify-content: space-between;
        }

        @media (max-width: 991px) {
          .header-content {
            max-width: 100%;
            flex-wrap: wrap;
          }
        }

        .header-elements {
          display: flex;
          gap: 16px;
        }

        .notification-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 24px;
          cursor: pointer;
        }

        .message-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 24px;
          cursor: pointer;
        }

        .user-profile {
          display: flex;
          align-items: stretch;
          gap: 12px;
          font-size: 16px;
          color: #1F2937;
          font-weight: 500;
        }

        .user-avatar {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 32px;
          border-radius: 50%;
          background: #E5E7EB;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .user-name {
          margin: auto 0;
          flex-grow: 1;
          flex-basis: auto;
        }

        .dropdown-container {
          display: flex;
          align-items: stretch;
          gap: 8px;
          margin: auto 0;
        }

        .dropdown-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 12px;
          cursor: pointer;
        }

        .main-content-wrapper {
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        @media (max-width: 991px) {
          .main-content-wrapper {
            max-width: 100%;
          }
        }

        /* Main content area */
        .main-content {
          display: flex;
          flex-direction: column;
          padding: 24px 0;
        }

        @media (max-width: 991px) {
          .main-content {
            max-width: 100%;
            padding: 16px 0;
          }
        }

        /* Page header section */
        .page-header {
          display: flex;
          width: 100%;
          align-items: stretch;
          gap: 20px;
          justify-content: space-between;
          margin-bottom: 32px;
        }

        @media (max-width: 991px) {
          .page-header {
            max-width: 100%;
            flex-wrap: wrap;
          }
        }

        .page-title-container {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          flex: 1;
        }

        @media (max-width: 991px) {
          .page-title-container {
            max-width: 100%;
          }
        }

        .page-title {
          color: #1F2937;
          font-size: 24px;
          font-weight: 600;
        }

        .page-description {
          color: #6B7280;
          margin-top: 8px;
          font-size: 14px;
        }

        @media (max-width: 991px) {
          .page-description {
            max-width: 100%;
          }
        }

        .primary-button {
          border-radius: 8px;
          background-color: #F05134;
          display: flex;
          align-items: stretch;
          gap: 6px;
          color: #FFFFFF;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          border: none;
          transition: background-color 0.2s;
        }

        .primary-button:hover {
          background-color: #B91C1C;
        }

        @media (max-width: 991px) {
          .primary-button {
            padding: 10px 20px;
          }
        }

        .button-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 16px;
          margin: auto 0;
        }

        .button-text {
          margin: auto 0;
        }

        /* Header actions group */
        .header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .contract-type-buttons {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .refresh-button {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 8px;
          background-color: #F3F4F6;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }

        .refresh-button:hover:not(:disabled) {
          background-color: #E5E7EB;
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-icon {
          width: 18px;
          height: 18px;
          color: #6B7280;
        }

        .refresh-icon.spinning {
          animation: spin 1s linear infinite;
        }

        .secondary-button {
          border-radius: 8px;
          background-color: #FFFFFF;
          border: 1px solid #F05134;
          display: flex;
          align-items: stretch;
          gap: 6px;
          color: #F05134;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .secondary-button:hover {
          background-color: #F05134;
          color: #FFFFFF;
        }

        @media (max-width: 991px) {
          .contract-type-buttons {
            flex-direction: column;
            gap: 8px;
            width: 100%;
          }
          
          .primary-button, .secondary-button {
            padding: 10px 20px;
            width: 100%;
            justify-content: center;
          }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* Stats cards section */
        .stats-cards {
          display: flex;
          width: 100%;
          gap: 20px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }

        .stat-card {
          border-radius: 8px;
          background-color: #FFFFFF;
          box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.1);
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 24px;
          min-width: 200px;
        }

        .stat-card:hover {
          transform: translateY(-2px);
          box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
        }

        .stat-title {
          color: #6B7280;
          font-size: 14px;
          font-weight: 500;
        }

        @media (max-width: 991px) {
          .stat-title {
            max-width: 100%;
          }
        }

        .stat-value-container {
          display: flex;
          margin-top: 16px;
          width: 100%;
          align-items: stretch;
          gap: 16px;
        }

        .stat-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 8px;
          background-color: #F3F4F6;
        }

        .stat-icon {
          width: 24px;
          height: 24px;
          color: #4B5563;
        }

        .stat-value {
          color: #1F2937;
          align-self: center;
          margin: auto 0;
          font-size: 24px;
          font-weight: 700;
        }

        .stat-trend {
          display: flex;
          margin-top: 12px;
          align-items: stretch;
          gap: 8px;
          font-size: 14px;
          font-weight: 500;
        }

        .trend-icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 20px;
        }

        .trend-icon {
          aspect-ratio: 1;
          object-fit: contain;
          object-position: center;
          width: 16px;
        }

        .trend-text {
          margin: auto 0;
          flex: 1;
        }

        .positive .trend-text {
          color: #16A34A;
        }

        .warning .trend-text {
          color: #F59E0B;
        }

        .negative .trend-text {
          color: #DC2626;
        }

        .info .trend-text {
          color: #2563EB;
        }

        .stat-subtitle {
          color: #9CA3AF;
          margin-top: 8px;
          font-size: 12px;
        }

        @media (max-width: 991px) {
          .stat-subtitle {
            max-width: 100%;
          }
        }

        /* Quick Action Center */
        .quick-action-center {
          margin-bottom: 32px;
        }

        @media (max-width: 991px) {
          .quick-action-center {
            max-width: 100%;
            margin-bottom: 24px;
          }
        }

        .section-title {
          color: #1F2937;
          margin-bottom: 16px;
          font-size: 18px;
          font-weight: 600;
        }

        @media (max-width: 991px) {
          .section-title {
            max-width: 100%;
            margin-bottom: 12px;
          }
        }

        /* Contracts section */
        .contracts-section {
          width: 100%;
        }

        @media (max-width: 991px) {
          .contracts-section {
            max-width: 100%;
          }
        }

        .contracts-layout {
          gap: 20px;
          display: flex;
        }

        @media (max-width: 991px) {
          .contracts-layout {
            flex-direction: column;
            align-items: stretch;
            gap: 0px;
          }
        }

        .contracts-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 66%;
          margin-left: 0px;
        }

        @media (max-width: 991px) {
          .contracts-column {
            width: 100%;
          }
        }

        .contracts-container {
          padding: 2px 0 200px 0;
          width: 100%;
        }

        @media (max-width: 991px) {
          .contracts-container {
            max-width: 100%;
            margin-top: 18px;
            padding-bottom: 100px;
          }
        }

        .filter-container {
          border-radius: 8px;
          background-color: #FFFFFF;
          box-shadow: 0px 1px 2px rgba(0, 0, 0, 0.1);
          width: 100%;
          padding: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 991px) {
          .filter-container {
            max-width: 100%;
            margin-right: 3px;
          }
        }

        .sidebar-column {
          display: flex;
          flex-direction: column;
          align-items: stretch;
          line-height: normal;
          width: 34%;
          margin-left: 20px;
        }

        @media (max-width: 991px) {
          .sidebar-column {
            width: 100%;
            margin-left: 0;
          }
        }
      `}</style>

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg shadow-lg">
          {error}
        </div>
      )}
    </div>
  );
}
