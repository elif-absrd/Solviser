import React, { useState, useEffect } from "react";
import api from '@/lib/api';
import { TrendingUp } from "lucide-react";

interface InsightsData {
  industryDistribution: Array<{
    industry: string;
    count: number;
    percentage: number;
    value: number;
  }>;
  monthlyGrowth: {
    percentage: number;
    direction: string;
    text: string;
  };
  totalContracts: number;
}

export default function ContractInsights() {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await api.get('/contracts/insights');
        setInsights(response.data);
      } catch (error) {
        console.error('Failed to fetch contract insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, []);

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Contract Insights</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!insights) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Contract Insights</h2>
        <p className="text-gray-500">Unable to load insights</p>
      </div>
    );
  }

  const getIndustryColor = (index: number) => {
    const colors = [
      'bg-blue-500',
      'bg-green-500',
      'bg-orange-500',
      'bg-purple-500',
      'bg-red-500',
      'bg-yellow-500'
    ];
    return colors[index % colors.length];
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Contract Insights</h2>
      
      {/* Industry Distribution Chart */}
      <div className="mb-6">
        <h3 className="text-md font-medium text-gray-700 mb-4">Contract Volume by Industry</h3>
        
        {/* Placeholder for pie chart - you can integrate a real chart library here */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-700">{insights.totalContracts}</span>
            </div>
          </div>
        </div>
        
        {/* Legend */}
        <div className="space-y-2">
          {insights.industryDistribution.map((item, index) => (
            <div key={item.industry} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getIndustryColor(index)}`}></div>
                <span className="text-sm text-gray-600">{item.industry}</span>
              </div>
              <span className="text-sm font-medium text-gray-800">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-md font-medium text-gray-700 mb-4">Monthly Contract Trends</h3>
        
        {/* Placeholder for trend chart */}
        <div className="h-20 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg mb-4 flex items-center justify-center">
          <TrendingUp className="w-8 h-8 text-blue-600" />
        </div>
        
        {/* Growth Insight */}
        <div className="flex items-center space-x-2 p-3 bg-green-50 rounded-lg">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-green-600" />
          </div>
          <p className="text-sm text-green-800">{insights.monthlyGrowth.text}</p>
        </div>
      </div>
    </div>
  );
}