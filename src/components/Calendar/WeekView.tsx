import React from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isToday } from 'date-fns';
import { useApp } from '../../context/AppContext';
import { Clock } from 'lucide-react';

interface WeekViewProps {
  currentDate: Date;
}

export function WeekView({ currentDate }: WeekViewProps) {
  const { state } = useApp();

  const weekStart = startOfWeek(currentDate);
  const weekEnd = endOfWeek(currentDate);
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const getMedicationsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return state.tracks
      .filter(track => track.isActive)
      .flatMap(track =>
        track.medicines.flatMap(medicine =>
          medicine.timings.map(timing => ({
            trackId: track.id,
            medicineId: medicine.id,
            medicineName: medicine.name,
            dosage: medicine.dosage,
            timing,
            condition: track.condition,
            taken: state.dailyLogs.some(
              log =>
                log.date === dateStr &&
                log.medicineId === medicine.id &&
                log.timing === timing &&
                log.taken
            ),
          }))
        )
      )
      .sort((a, b) => a.timing.localeCompare(b.timing));
  };

  return (
    <div className="space-y-6">
      {days.map(day => {
        const medications = getMedicationsForDay(day);
        const completedCount = medications.filter(med => med.taken).length;
        
        return (
          <div
            key={day.toISOString()}
            className={`p-6 rounded-xl border-2 ${
              isToday(day)
                ? 'bg-blue-50 border-blue-200'
                : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`text-lg font-semibold ${
                  isToday(day) ? 'text-blue-900' : 'text-gray-900'
                }`}>
                  {format(day, 'EEEE, MMM d')}
                </h3>
                {medications.length > 0 && (
                  <p className="text-sm text-gray-600">
                    {completedCount}/{medications.length} completed
                  </p>
                )}
              </div>
              
              {medications.length > 0 && (
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                  completedCount === medications.length
                    ? 'bg-green-100 text-green-700'
                    : completedCount > 0
                    ? 'bg-yellow-100 text-yellow-700'
                    : 'bg-gray-100 text-gray-700'
                }`}>
                  {Math.round((completedCount / medications.length) * 100)}%
                </div>
              )}
            </div>

            {medications.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No medications scheduled</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {medications.map((med, index) => (
                  <div
                    key={`${med.medicineId}-${med.timing}-${index}`}
                    className={`p-3 rounded-lg border ${
                      med.taken
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-gray-900">
                        {med.medicineName}
                      </span>
                      <span className="text-xs text-gray-600">{med.timing}</span>
                    </div>
                    <p className="text-xs text-gray-600">{med.dosage}</p>
                    <p className="text-xs text-gray-500">{med.condition}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
