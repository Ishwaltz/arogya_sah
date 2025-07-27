import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isToday, isSameMonth, startOfWeek, endOfWeek } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { Pill, Calendar as CalendarEventIcon } from 'lucide-react';

interface MonthViewProps {
  currentDate: Date;
}

export function MonthView({ currentDate }: MonthViewProps) {
  const { state } = useApp();
  const patientId = state.user?.userType === 'patient' ? state.user.id : null;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getTracksForDay = (date: Date) => {
    return state.tracks.filter(track => {
      if (!track.isActive || (patientId && track.patientId !== patientId)) return false;
      const trackStart = new Date(track.startDate);
      const trackEnd = track.endDate ? new Date(track.endDate) : new Date(8640000000000000); // Far future date
      return date >= trackStart && date <= trackEnd;
    });
  };

  const getAppointmentsForDay = (date: Date) => {
    return state.appointments.filter(appt => {
      if (patientId && appt.patientId !== patientId) return false;
      return format(appt.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
    });
  };

  return (
    <div>
      <div className="grid grid-cols-7 gap-1 mb-4">
        {weekDays.map(day => <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map(day => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const tracks = getTracksForDay(day);
          const appointments = getAppointmentsForDay(day);
          const events = [...tracks, ...appointments];
          
          return (
            <div
              key={day.toISOString()}
              className={`min-h-[120px] p-2 border rounded-lg transition-colors flex flex-col ${
                isToday(day) ? 'bg-blue-50 border-blue-200' : isCurrentMonth ? 'bg-white border-gray-200 hover:bg-gray-50' : 'bg-gray-50 border-gray-100'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-sm font-medium ${isToday(day) ? 'text-blue-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                  {format(day, 'd')}
                </span>
                {events.length > 0 && <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">{events.length}</span>}
              </div>
              <div className="space-y-1 overflow-y-auto flex-grow">
                {appointments.slice(0, 1).map(appt => (
                  <div key={appt.id} className="text-xs p-1 bg-purple-100 text-purple-700 rounded truncate flex items-center space-x-1" title={appt.title}>
                    <CalendarEventIcon className="w-3 h-3 flex-shrink-0" />
                    <span>{appt.title}</span>
                  </div>
                ))}
                {tracks.slice(0, 2).map(track => (
                  <div key={track.id} className="text-xs p-1 bg-green-100 text-green-700 rounded truncate flex items-center space-x-1" title={track.condition}>
                    <Pill className="w-3 h-3 flex-shrink-0" />
                    <span>{track.condition}</span>
                  </div>
                ))}
                {events.length > 3 && <div className="text-xs text-gray-500 mt-1">+{events.length - 3} more</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
