// File: app/dashboard/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Download, PlusCircle, RotateCcw, AlertCircle } from "lucide-react";
import api from '@/lib/api';
import { useUser } from '../hooks/use-user'; // --- 1. Import the useUser hook ---

// NOTE: The UserProfile interface is no longer needed here, 
// as the type is handled by the useUser hook.

// Define the structure for the dashboard data fetched from the API
interface DashboardStats {
  overallRiskScore: number;
  industryAvgScore: number;
  aiPredictionScore: number;
  defaultsLast90Days: number;
  openDisputes: number;
  totalDisputes: number;
  avgPaymentDelay: number;
}

// Reusable component for the statistics cards
const StatCard = ({ title, value, subtitle, colorClass = 'text-green-500' }: { title: string, value: string | number, subtitle: string, colorClass?: string }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
    <h2 className="text-gray-500 text-sm font-medium mb-2">{title}</h2>
    <div className={`text-3xl font-bold ${colorClass}`}>{value}</div>
    <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
  </div>
);

export default function DashboardPage() {
  const router = useRouter();
  // --- 2. Get user data from the hook ---
  // We alias `isLoading` to `isUserLoading` to avoid naming conflicts.
  const { user, isLoading: isUserLoading } = useUser(); 

  // --- 3. Remove the local user state ---
  // const [user, setUser] = useState<UserProfile | null>(null); // This is no longer needed
  
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // --- 4. Simplify the API call in useEffect ---
        // We only need to fetch the dashboard stats now.
        const statsResponse = await api.get('/dashboard/stats');
        setStats(statsResponse.data);

      } catch (err: any) {
        console.error("Dashboard Error:", err);
        if (err.response?.status !== 401) {
            setError(err.response?.data?.error || "Failed to load dashboard data.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [router]); // `router` dependency can be removed if not used for navigation logic inside useEffect

  // --- 5. Combine loading states ---
  // Show the loader if we are waiting for the user OR the dashboard stats.
  if (isUserLoading || isLoading) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-50">
            <RotateCcw className="w-8 h-8 text-[#f05134] animate-spin" />
        </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen text-gray-800 font-sans">
      <main className="container mx-auto p-6">
        {/* Top Welcome Section */}
        <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
          <div>
            {/* The `user` object now comes directly from our hook */}
            <h1 className="text-3xl font-bold">Welcome back, {user ? user.name.split(' ')[0] : 'User'}!</h1>
            <p className="text-gray-600 mt-1">Here’s a snapshot of your business health.</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="bg-white hover:bg-gray-100 text-gray-700 font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors border border-gray-300">
              <Download size={16} />
              Export PDF
            </button>
          </div>
        </div>
        
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-8 flex items-center gap-3">
                <AlertCircle size={20} />
                <p>{error}</p>
            </div>
        )}

        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button className="bg-[#f05134] hover:bg-white text-white hover:text-[#f05134] font-bold py-2 px-5 rounded-lg transition-colors duration-300 flex items-center gap-2 border-2 border-transparent hover:border-[#f05134]">
            <PlusCircle size={18} />
            New Contract
          </button>
          <button className="bg-white hover:bg-gray-100 text-gray-700 font-semibold py-2 px-5 rounded-lg flex items-center gap-2 transition-colors border border-gray-300">
            View Reports
          </button>
        </div>

        {/* Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StatCard 
            title="Overall Risk Score" 
            value={stats ? `${stats.overallRiskScore}/10` : '-'} 
            subtitle="High Risk" 
            colorClass="text-red-500" 
          />
          <StatCard 
            title="Industry Avg. Score" 
            value={stats ? `${stats.industryAvgScore}/10` : '-'} 
            subtitle="Average" 
            colorClass="text-orange-500" 
          />
          <StatCard 
            title="AI Prediction Score" 
            value={stats ? `${stats.aiPredictionScore}/10` : '-'} 
            subtitle="Good" 
            colorClass="text-green-500" 
          />
        </div>

        {/* Lower Grid for Defaults, Disputes, Delays */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <StatCard 
            title="Defaults" 
            value={stats ? stats.defaultsLast90Days : '-'} 
            subtitle="in last 90 days"
            colorClass="text-gray-800" 
          />
          <StatCard 
            title="Disputes" 
            value={stats ? `${stats.openDisputes}/${stats.totalDisputes}` : '-/-'} 
            subtitle="Open / Total"
            colorClass="text-gray-800" 
          />
          <StatCard 
            title="Delays" 
            value={stats ? `${stats.avgPaymentDelay} Days` : '-'} 
            subtitle="Avg payment delay"
            colorClass="text-gray-800" 
          />
        </div>
      </main>
    </div>
  );
}