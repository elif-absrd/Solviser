"use client";

// import { Button } from "@/components/ui/button";
import { Download, PlusCircle, FileText, RotateCcw } from "lucide-react";

export default function DashboardPage() {
  return (
    <div>
      {/* Top Welcome Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, Rahul!</h1>
          <p className="text-gray-600">Here’s a snapshot of your business health.</p>
        </div>

        {/* Right Side: Export Button */}
<button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
  <Download size={16} />
  Export PDF
</button>

      </div>

      {/* Action Buttons Row */}
      <div className="flex gap-2 mb-6">
<button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center gap-2">
  <Download size={16} />
  Export PDF
</button>

        <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded">
          New Control
        </button>
        <button className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded">
          Block Buyer
        </button>
        <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
          View Report
        </button>
      </div>

      {/* Grid of Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 mb-2">Overall Risk Score</h2>
          <div className="text-3xl font-bold text-red-500">5/10</div>
          <p className="text-sm text-gray-400">High Risk</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 mb-2">Industry Avg. Score</h2>
          <div className="text-3xl font-bold text-orange-500">6/10</div>
          <p className="text-sm text-gray-400">Average</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 mb-2">AI Prediction Score</h2>
          <div className="text-3xl font-bold text-green-600">8/10</div>
          <p className="text-sm text-gray-400">Good</p>
        </div>
      </div>

      {/* Lower Grid for Defaults, Disputes, Delays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 mb-2">Defaults</h2>
          <p className="text-xl font-semibold">3</p>
          <p className="text-sm text-gray-400">in last 90 days</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 mb-2">Disputes</h2>
          <p className="text-xl font-semibold">5/12</p>
          <p className="text-sm text-gray-400">Open / Closed</p>
        </div>

        <div className="p-6 bg-white shadow rounded-lg">
          <h2 className="text-gray-500 mb-2">Delays</h2>
          <p className="text-xl font-semibold">22 Days</p>
          <p className="text-sm text-gray-400">Avg payment delay</p>
        </div>
      </div>
    </div>
  );
}
