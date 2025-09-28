"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="p-6">
      {/* --- Search Bar --- */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Search</h2>

        <div className="flex items-center gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter GST, PAN, or Company Name..."
            className="w-full rounded-xl border border-gray-300 px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-5 py-2 rounded-xl">
            <Search size={18} /> Search
          </button>
        </div>

        {/* --- Alternative Search --- */}
        <div className="mt-4 text-sm text-gray-600">
          <p className="mb-2">You can also search by</p>
          <div className="flex flex-wrap gap-2">
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-md cursor-pointer">
              GST Number
            </span>
            <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-md cursor-pointer">
              PAN Number
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md cursor-pointer">
              Company Name
            </span>
          </div>
        </div>
      </div>

      {/* --- Search Results Section --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Business Scores
          </h3>
          <p className="text-gray-600 text-sm">
            Get comprehensive credit scores and risk assessments based on
            multiple data points.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            AI Predictions
          </h3>
          <p className="text-gray-600 text-sm">
            Our AI analyzes patterns to predict future payment behavior and
            business stability.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Legal Insights
          </h3>
          <p className="text-gray-600 text-sm">
            View litigation history, disputes, and other legal matters affecting
            the business.
          </p>
        </div>
      </div>

      {/* --- Recent Searches --- */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Recent Searches
        </h3>
        <ul className="space-y-2 text-gray-700">
          <li className="border-b pb-2">Solver Pvt Ltd - 22AABCU9603R1Z3</li>
          <li className="border-b pb-2">Tech Solutions - 27AACCT3225E1ZX</li>
          <li>Alpha Industries - 09AAACW3439L1Z3</li>
        </ul>
      </div>
    </div>
  );
}
