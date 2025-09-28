"use client";

export default function Pages() {
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <h1 className="text-2xl font-semibold mb-4">Smart Contract Management</h1>
      <p className="text-gray-600 mb-6">
        Create, manage, track, and analyze smart B2B contracts with AI-enabled risk assessment
      </p>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-6 gap-4 mb-6">
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <h2 className="text-xl font-bold">42</h2>
          <p>Active Contracts</p>
          <span className="text-green-500 text-sm">8% from last month</span>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <h2 className="text-xl font-bold">128</h2>
          <p>Completed Contracts</p>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <h2 className="text-xl font-bold">7</h2>
          <p>Contracts at Risk</p>
          <span className="text-orange-500 text-sm">3% from last month</span>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <h2 className="text-xl font-bold">5/12</h2>
          <p>Defaulted Contracts</p>
          <span className="text-red-500 text-sm">1 new this month</span>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <h2 className="text-xl font-bold">5/12</h2>
          <p>Disputes Contracts</p>
          <span className="text-red-500 text-sm">1 new this month</span>
        </div>
        <div className="bg-white p-4 shadow rounded-lg text-center">
          <h2 className="text-xl font-bold">12</h2>
          <p>In Renewal</p>
          <span className="text-red-500 text-sm">5 due this week</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 mb-6">
        <button className="bg-red-500 text-white px-4 py-2 rounded">New Smart Contract</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Upload Contract Document</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">View Risk Report</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Download All Contracts Reports</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Notify Buyers</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Renew Contract</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Report Dispute</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded">Export Contract Analytics</button>
      </div>

      {/* Filter + Risk Section */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="font-semibold mb-2">Filter Contracts</h3>
          {/* Add table here */}
        </div>
        <div className="bg-white p-4 shadow rounded-lg">
          <h3 className="font-semibold mb-2">Risk Distribution</h3>
          {/* Add chart here */}
        </div>
      </div>
    </main>
  );
}
