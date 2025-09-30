// components/RiskChart.tsx
"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Active", value: 42 },
  { name: "Completed", value: 128 },
  { name: "At Risk", value: 7 },
  { name: "Defaulted", value: 5 },
  { name: "Disputes", value: 5 },
  { name: "Renewal", value: 12 },
];

const COLORS = ["#ef4444", "#f97316", "#fb923c", "#facc15", "#22c55e", "#3b82f6"];

export default function RiskChart() {
  return (
    <div className="bg-white shadow rounded p-4">
      <h2 className="text-lg font-bold mb-4">Risk Distribution</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" outerRadius={120}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
