import React from 'react';
import { format } from 'date-fns';
import { CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TodaysChecklist } from './TodaysChecklist';
import { StatsCards } from './StatsCards';

export function Dashboard() {
  const { state } = useApp();
  const today = new Date();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Good morning, {state.user?.name}!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Today is {format(today, 'EEEE, MMMM do, yyyy')}
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Today's Checklist */}
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Today's Medications</h2>
              <p className="text-gray-600">Keep track of your daily medications</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <TodaysChecklist />
        </div>
      </div>
    </div>
  );
}
