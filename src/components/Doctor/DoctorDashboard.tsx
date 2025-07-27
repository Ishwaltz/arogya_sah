import React from 'react';
import { Users, Activity, AlertTriangle, TrendingUp, Bell } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { t } from '../../utils/translations';

export function DoctorDashboard() {
  const { state } = useApp();

  const doctor = state.doctors.find(d => d.id === state.user?.id);
  const patientIds = doctor?.patients || [];
  
  const recentRedFlags = state.dailyCheckIns
    .filter(checkIn => patientIds.includes(checkIn.userId) && checkIn.redFlags.length > 0)
    .slice(-5).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const recentChatRedFlags = state.chatHistory
    .filter(chat => patientIds.includes(chat.userId) && chat.isRedFlag)
    .slice(-5).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  const patientTracks = state.tracks.filter(t => patientIds.includes(t.patientId));
  const avgCompliance = patientTracks.length > 0
    ? patientTracks.reduce((acc, track) => acc + track.completionRate, 0) / patientTracks.length
    : 0;

  const stats = [
    { title: t('totalPatients', state.language), value: patientIds.length, subtitle: t('underYourCare', state.language), icon: Users, color: 'text-brand-dark', bgColor: 'bg-brand-light/30' },
    { title: t('activePrescriptions', state.language), value: state.tracks.filter(t => t.isActive && patientIds.includes(t.patientId)).length, subtitle: t('currentlyPrescribed', state.language), icon: Activity, color: 'text-green-600', bgColor: 'bg-green-500/10' },
    { title: t('recentAlerts', state.language), value: recentRedFlags.length + recentChatRedFlags.length, subtitle: t('last24h', state.language), icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-500/10' },
    { title: t('avgCompliance', state.language), value: patientTracks.length > 0 ? `${avgCompliance.toFixed(0)}%` : 'N/A', subtitle: t('patientAdherence', state.language), icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-500/10' },
  ];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{t('welcomeBack', state.language)}, Dr. {state.user?.name}!</h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mt-2">{t('doctorDashboard', state.language)} - {format(new Date(), 'EEEE, MMMM do, yyyy')}</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className={`${stat.bgColor} rounded-2xl p-6`}>
            <div className="flex items-center justify-between mb-4"><div className={`p-3 rounded-xl`}><stat.icon className={`w-6 h-6 ${stat.color}`} /></div></div>
            <div><p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{stat.value}</p><p className="text-sm font-medium text-gray-700 dark:text-gray-300">{stat.title}</p><p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.subtitle}</p></div>
          </div>
        ))}
      </div>

      {(recentRedFlags.length > 0 || recentChatRedFlags.length > 0) && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700"><div className="flex items-center space-x-3"><div className="p-2 bg-red-100 dark:bg-red-900 rounded-lg"><Bell className="w-6 h-6 text-red-600 dark:text-red-400" /></div><div><h2 className="text-xl font-semibold text-gray-900 dark:text-white">{t('recentHealthAlerts', state.language)}</h2><p className="text-gray-600 dark:text-gray-300">{t('patientRedFlags', state.language)}</p></div></div></div>
          <div className="p-6 space-y-4">
            {recentRedFlags.map(checkIn => (<div key={checkIn.id} className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"><div className="flex items-start justify-between"><div><h4 className="font-medium text-red-900 dark:text-red-100">{t('dailyCheckinAlert', state.language)}</h4><p className="text-red-700 dark:text-red-300 text-sm mt-1">{t('redFlags', state.language)}: {checkIn.redFlags.join(', ')}</p><p className="text-red-600 dark:text-red-400 text-sm">{t('mood', state.language)}: {checkIn.mood}/10 | {t('symptoms', state.language)}: {checkIn.symptoms.join(', ')}</p></div><span className="text-xs text-red-600 dark:text-red-400">{format(new Date(checkIn.timestamp), 'MMM d, HH:mm')}</span></div></div>))}
            {recentChatRedFlags.map(chat => (<div key={chat.id} className="p-4 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg"><div className="flex items-start justify-between"><div><h4 className="font-medium text-orange-900 dark:text-orange-100">{t('aiChatAlert', state.language)}</h4><p className="text-orange-700 dark:text-orange-300 text-sm mt-1">{t('patientMessage', state.language)}: "{chat.message}"</p></div><span className="text-xs text-orange-600 dark:text-orange-400">{format(new Date(chat.timestamp), 'MMM d, HH:mm')}</span></div></div>))}
          </div>
        </div>
      )}
    </div>
  );
}
