import React from 'react';
import { Activity, Target, Clock, TrendingUp } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

export function StatsCards() {
  const { state } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');

  const patientTracks = state.tracks.filter(track => track.patientId === state.user?.id);
  const activeTracks = patientTracks.filter(track => track.isActive).length;

  const todaysMedications = patientTracks
    .filter(track => track.isActive)
    .flatMap(track =>
      track.medicines.flatMap(medicine =>
        medicine.timings.map(timing => ({
          medicineId: medicine.id,
          timing,
        }))
      )
    );
  
  const todaysTakenLogs = state.dailyLogs.filter(log => 
    log.date === today && 
    patientTracks.some(pt => pt.id === log.trackId) &&
    log.taken
  );
  
  const todaysTaken = todaysTakenLogs.length;
  const todaysTotal = todaysMedications.length;
  const todaysCompletion = todaysTotal > 0 ? (todaysTaken / todaysTotal) * 100 : 0;

  const totalMedicines = patientTracks.reduce((acc, track) => acc + track.medicines.length, 0);

  const overallCompletion = patientTracks.length > 0 
    ? patientTracks.reduce((acc, track) => acc + track.completionRate, 0) / patientTracks.length 
    : 0;

  const stats = [
    {
      title: 'Active Tracks',
      value: activeTracks,
      subtitle: 'Currently monitoring',
      icon: Activity,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Today\'s Progress',
      value: `${todaysTaken}/${todaysTotal}`,
      subtitle: `${todaysCompletion.toFixed(0)}% complete`,
      icon: Target,
      color: 'bg-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Total Medicines',
      value: totalMedicines,
      subtitle: 'Being tracked',
      icon: Clock,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      title: 'Overall Completion',
      value: `${overallCompletion.toFixed(0)}%`,
      subtitle: 'Average compliance',
      icon: TrendingUp,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div key={index} className={`${stat.bgColor} rounded-2xl p-6`}>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 ${stat.color} rounded-xl`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-gray-700">{stat.title}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
