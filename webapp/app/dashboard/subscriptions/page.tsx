// File: apps/webapp/src/app/dashboard/subscriptions/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { RotateCcw, AlertCircle, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import ForbiddenPage from '@/components/ForbiddenPage'; // <-- Import the new component

// --- Type Definitions for Data from our API ---
interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  organization: {
    name: string;
    owner: {
      email: string;
    } | null;
  };
  plan: {
    name: string;
  };
}

interface Pagination {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
}

// --- Main Page Component ---
export default function SubscriptionsManagementPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [filters, setFilters] = useState({ planName: '', status: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isForbidden, setIsForbidden] = useState(false); // <-- NEW state to handle 403 errors

  const fetchData = useCallback(async (page = 1) => {
    setIsLoading(true);
    setError(null);
    setIsForbidden(false);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        pageSize: '10',
      });
      if (filters.planName) params.append('planName', filters.planName);
      if (filters.status) params.append('status', filters.status);

      const response = await api.get(`/admin/subscriptions?${params.toString()}`);
      setSubscriptions(response.data.data);
      setPagination(response.data.pagination);
    } catch (err: any) {
      if (err.response?.status === 403) {
          setIsForbidden(true); // <-- Set forbidden state
      } else {
          setError(err.response?.data?.error || "Failed to load subscription data.");
      }
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleFilterSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      fetchData(1);
  }

  const handlePageChange = (newPage: number) => {
      if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
          fetchData(newPage);
      }
  };

  // --- THE DEFINITIVE FIX: Top-level render checks ---
  if (isForbidden) {
      return <ForbiddenPage />;
  }
  
  if (isLoading) {
    return <div className="flex items-center justify-center p-8"><RotateCcw className="w-8 h-8 animate-spin text-[#f05134]" /></div>;
  }

  return (
    <div className="p-6 bg-slate-50 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscriptions Management</h1>
      <p className="text-gray-600 mb-6">View and manage all customer subscriptions on the platform.</p>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6">
        <form onSubmit={handleFilterSubmit} className="flex flex-wrap items-center gap-4">
            <Filter size={20} className="text-gray-500" />
            <select name="planName" value={filters.planName} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Plans</option>
                <option value="Free">Free</option>
                <option value="Starter">Starter</option>
                <option value="Growth">Growth</option>
                <option value="Business Pro">Business Pro</option>
                <option value="Enterprise">Enterprise</option>
            </select>
             <select name="status" value={filters.status} onChange={handleFilterChange} className="p-2 border border-gray-300 rounded-md text-sm">
                <option value="">All Statuses</option>
                <option value="active">Active</option>
                <option value="past_due">Past Due</option>
                <option value="canceled">Canceled</option>
            </select>
            <button type="submit" className="bg-[#f05134] text-white font-semibold py-2 px-4 rounded-lg hover:bg-opacity-90">Apply Filters</button>
        </form>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg my-8 flex items-center gap-3"><AlertCircle size={20} /><p>{error}</p></div>}
      
      {/* Subscriptions Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-600">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                    <th scope="col" className="px-6 py-3">Organization Name</th>
                    <th scope="col" className="px-6 py-3">Owner Email</th>
                    <th scope="col" className="px-6 py-3">Plan</th>
                    <th scope="col" className="px-6 py-3">Status</th>
                    <th scope="col" className="px-6 py-3">End of Period</th>
                </tr>
            </thead>
            <tbody>
                {subscriptions.map(sub => (
                    <tr key={sub.id} className="bg-white border-b hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{sub.organization.name}</td>
                        <td className="px-6 py-4">{sub.organization.owner?.email || 'N/A'}</td>
                        <td className="px-6 py-4">{sub.plan.name}</td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${sub.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                {sub.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">{new Date(sub.currentPeriodEnd).toLocaleDateString('en-IN')}</td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
      
      {/* Pagination Controls */}
      {pagination && pagination.total > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>Page {pagination.page} of {pagination.totalPages}</span>
            <div className="flex gap-2">
                <button 
                    onClick={() => handlePageChange(pagination.page - 1)} 
                    disabled={pagination.page <= 1}
                    className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronLeft size={16} />
                </button>
                <button 
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages}
                    className="p-2 border rounded-md hover:bg-gray-100 disabled:opacity-50"
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
      )}
    </div>
  );
}