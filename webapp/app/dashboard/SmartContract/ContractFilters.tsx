import React from "react";

interface ContractFiltersProps {
  filters: {
    buyer: string;
    industry: string;
    status: string;
    sortBy: string;
  };
  onFilterChange: (filters: Partial<{
    buyer: string;
    industry: string;
    status: string;
    sortBy: string;
  }>) => void;
  onClearFilters: () => void;
}

export default function ContractFilters({ filters, onFilterChange, onClearFilters }: ContractFiltersProps) {
  const industries = [
    { value: "", label: "All Industries" },
    { value: "Textiles", label: "Textiles" },
    { value: "Technology", label: "Technology" },
    { value: "Agriculture", label: "Agriculture" },
    { value: "Manufacturing", label: "Manufacturing" },
    { value: "Consulting", label: "Consulting" }
  ];

  const statuses = [
    { value: "", label: "All Statuses" },
    { value: "active", label: "Active" },
    { value: "completed", label: "Completed" },
    { value: "at_risk", label: "At Risk" },
    { value: "defaulted", label: "Defaulted" },
    { value: "in_renewal", label: "In Renewal" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const sortOptions = [
    { value: "riskScore", label: "Risk Score (High to Low)" },
    { value: "contractValue", label: "Contract Value (High to Low)" },
    { value: "endDate", label: "End Date (Earliest First)" },
    { value: "createdAt", label: "Recently Created" }
  ];

  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filter Contracts</h3>
        <button
          onClick={onClearFilters}
          className="px-3 py-1.5 text-sm text-red-600 border border-red-600 rounded-full hover:bg-red-50 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Buyer Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Buyer</label>
          <input
            type="text"
            placeholder="Search buyer name..."
            value={filters.buyer}
            onChange={(e) => onFilterChange({ buyer: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
          />
        </div>

        {/* Industry Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Industry</label>
          <select
            value={filters.industry}
            onChange={(e) => onFilterChange({ industry: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            {industries.map((industry) => (
              <option key={industry.value} value={industry.value}>
                {industry.label}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Status</label>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            {statuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort By Filter */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange({ sortBy: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}