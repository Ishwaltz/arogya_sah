import React from 'react';
import { format } from 'date-fns';
import { TodaysChecklist } from '../Dashboard/TodaysChecklist';

interface DayViewProps {
  currentDate: Date;
}

export function DayView({ currentDate }: DayViewProps) {
  const isToday = format(currentDate, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">
          {format(currentDate, 'EEEE, MMMM do, yyyy')}
        </h2>
        {isToday && (
          <p className="text-blue-600 font-medium mt-1">Today</p>
        )}
      </div>

      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {isToday ? 'Today\'s' : 'Scheduled'} Medications
        </h3>
        <TodaysChecklist />
      </div>
    </div>
  );
}
