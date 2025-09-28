import React from "react";

interface StatCardProps {
  title: string;
  icon: React.ReactNode;
  value: string;
  subtext: string;
  subtextColor: string;
  extraText?: string;
}

export default function StatCard({
  title,
  icon,
  value,
  subtext,
  subtextColor,
  extraText,
}: StatCardProps) {
  return (
    <div className="flex flex-col p-6 bg-white rounded-xl shadow-lg border border-gray-100 transform transition-transform hover:scale-105">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-gray-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      </div>

      <div className="flex items-center justify-start gap-4 mb-2">
        {icon}
        <span className="text-4xl font-bold text-gray-800">{value}</span>
      </div>

      <p className="text-sm font-semibold" style={{ color: subtextColor }}>
        {subtext}
      </p>
      {extraText && <p className="text-xs text-gray-400 mt-1">{extraText}</p>}
    </div>
  );
}
