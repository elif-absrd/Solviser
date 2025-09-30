// components/FilterContracts.tsx
"use client";

const contracts = [
  { buyer: "ABC Corp", industry: "Finance", status: "Active", sortBy: "Date" },
  { buyer: "XYZ Ltd", industry: "Tech", status: "Completed", sortBy: "Priority" },
  { buyer: "Mega Inc", industry: "Retail", status: "At Risk", sortBy: "Date" },
];

export default function FilterContracts() {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">Filter Contracts</h2>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Buyer</th>
            <th className="p-2">Industry</th>
            <th className="p-2">Status</th>
            <th className="p-2">Sort By</th>
          </tr>
        </thead>
        <tbody>
          {contracts.map((c, i) => (
            <tr key={i} className="border-b hover:bg-gray-50">
              <td className="p-2">{c.buyer}</td>
              <td className="p-2">{c.industry}</td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    c.status === "Active"
                      ? "bg-green-100 text-green-600"
                      : c.status === "Completed"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {c.status}
                </span>
              </td>
              <td className="p-2">{c.sortBy}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
