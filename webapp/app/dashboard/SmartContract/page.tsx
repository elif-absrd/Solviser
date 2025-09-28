"use client";
import React, { useState } from "react";
import AddNewContractPage from "./AddNewContractPage";
import StatCard from "./StatCard";
import { DocumentIcon, CheckIcon, AlertCircleIcon, HandshakeIcon, ClockIcon } from "./icons";

export default function SmartContractPage() {
  const [currentView, setCurrentView] = useState<"dashboard" | "newContract">(
    "dashboard"
  );

  if (currentView === "newContract") {
    return <AddNewContractPage onGoBack={() => setCurrentView("dashboard")} />;
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-semibold text-gray-800">
            Smart Contract Management
          </h1>
          <p className="text-gray-500 mt-1">
            Create, manage, track, and analyze smart B2B contracts with AI-enabled risk assessment
          </p>
        </div>
        <button
          onClick={() => setCurrentView("newContract")}
          className="mt-4 md:mt-0 px-6 py-2.5 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 transition-colors"
        >
          New Smart contract
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        <StatCard title="Active Contracts" icon={<DocumentIcon className="w-10 h-10 text-orange-500" />} value="42" subtext="8% from last month" subtextColor="#22c55e" />
        <StatCard title="Completed Contracts" icon={<CheckIcon className="w-10 h-10 text-green-500" />} value="128" subtext="Total completed" subtextColor="#6b7280" />
        <StatCard title="Contracts at Risk" icon={<AlertCircleIcon className="w-10 h-10 text-yellow-500" />} value="7" subtext="3% from last month" subtextColor="#f97316" />
        <StatCard title="Defaulted Contracts" icon={<HandshakeIcon className="w-10 h-10 text-red-500" />} value="5/12" subtext="1 new this month" subtextColor="#ef4444" />
        <StatCard title="Disputes Contracts" icon={<HandshakeIcon className="w-10 h-10 text-red-500" />} value="5/12" subtext="1 new this month" subtextColor="#ef4444" />
        <StatCard title="In Renewal" icon={<ClockIcon className="w-10 h-10 text-blue-500" />} value="12" subtext="5 due this week" subtextColor="#3b82f6" />
      </div>
    </div>
  );
}
