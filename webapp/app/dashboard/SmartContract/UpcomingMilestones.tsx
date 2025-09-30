import React, { useState, useEffect } from "react";
import api from '@/lib/api';
import { Calendar, DollarSign, RefreshCw, Clock } from "lucide-react";

interface Milestone {
  id: string;
  type: string;
  title: string;
  company: string;
  contractValue?: number;
  dueDate: string;
  daysUntilDue: number;
  urgency: string;
  contractId: string;
}

export default function UpcomingMilestones() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMilestones = async () => {
      try {
        const response = await api.get('/contracts/milestones');
        setMilestones(response.data);
      } catch (error) {
        console.error('Failed to fetch milestones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMilestones();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return <DollarSign className="w-5 h-5 text-green-600" />;
      case 'renewal':
        return <RefreshCw className="w-5 h-5 text-blue-600" />;
      case 'expiry':
        return <Calendar className="w-5 h-5 text-red-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-600" />;
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'urgent':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getDueText = (daysUntilDue: number, urgency: string) => {
    if (daysUntilDue === 0) return 'Due today';
    if (daysUntilDue === 1) return 'Due tomorrow';
    if (daysUntilDue < 0) return `Overdue by ${Math.abs(daysUntilDue)} days`;
    return `Due in ${daysUntilDue} days`;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Upcoming Expiry & Milestones</h2>
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h2 className="text-lg font-semibold text-gray-800 mb-6">Upcoming Expiry & Milestones</h2>
      
      {milestones.length === 0 ? (
        <p className="text-gray-500 text-sm">No upcoming milestones</p>
      ) : (
        <div className="space-y-4">
          {milestones.map((milestone) => (
            <div
              key={milestone.id}
              className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => alert(`Milestone details: ${milestone.title}`)}
            >
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                {getIcon(milestone.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 truncate">
                  {milestone.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {milestone.company}
                  {milestone.contractValue && (
                    <span className="ml-1">• {formatCurrency(milestone.contractValue)}</span>
                  )}
                </p>
                <p className={`text-xs mt-1 font-medium ${getUrgencyColor(milestone.urgency)}`}>
                  {getDueText(milestone.daysUntilDue, milestone.urgency)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}