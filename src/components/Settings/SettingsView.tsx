import React, { useState } from 'react';
import { Settings, Globe, Bell, Moon, Sun, User, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { t } from '../../utils/translations';

export function SettingsView() {
  const { state, dispatch } = useApp();
  const [selectedLanguage, setSelectedLanguage] = useState(state.language);
  
  const assignedDoctor = state.user?.assignedDoctor 
    ? state.doctors.find(d => d.id === state.user.assignedDoctor) 
    : null;

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
    dispatch({ type: 'SET_LANGUAGE', payload: language });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700"><div className="flex items-center space-x-3"><div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg"><Settings className="w-6 h-6 text-gray-600 dark:text-gray-300" /></div><div><h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('settings', state.language)}</h1><p className="text-gray-600 dark:text-gray-300">{t('managePreferences', state.language)}</p></div></div></div>
        <div className="p-6 space-y-8">
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><User className="w-5 h-5 mr-2" />{t('profileInfo', state.language)}</h2><div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-3"><div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t('name', state.language)}:</span><span className="font-medium text-gray-900 dark:text-white">{state.user?.name}</span></div><div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t('emailAddress', state.language)}:</span><span className="font-medium text-gray-900 dark:text-white">{state.user?.email || 'N/A'}</span></div>{assignedDoctor && (<div className="flex justify-between items-center"><span className="text-gray-600 dark:text-gray-300 flex items-center"><Stethoscope className="w-4 h-4 mr-1" />{t('assignedDoctor', state.language)}:</span><span className="font-medium text-gray-900 dark:text-white">{assignedDoctor.name}</span></div>)}{state.user?.emergencyContact && (<div className="flex justify-between"><span className="text-gray-600 dark:text-gray-300">{t('emergencyContact', state.language)}:</span><span className="font-medium text-gray-900 dark:text-white">{state.user.emergencyContact}</span></div>)}</div></div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">{state.theme === 'light' ? <Sun className="w-5 h-5 mr-2" /> : <Moon className="w-5 h-5 mr-2" />}{t('appearance', state.language)}</h2><div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4"><div className="flex items-center justify-between"><div><span className="font-medium text-gray-900 dark:text-white">{t('darkMode', state.language)}</span><p className="text-sm text-gray-600 dark:text-gray-300">{t('themeSwitch', state.language)}</p></div><button onClick={() => dispatch({ type: 'TOGGLE_THEME' })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.theme === 'dark' ? 'bg-brand-dark' : 'bg-gray-200'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} /></button></div></div></div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><Globe className="w-5 h-5 mr-2" />{t('language', state.language)}</h2>
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex space-x-6">
                {(['en', 'hi'] as const).map(lang => (
                  <label key={lang} className="flex items-center">
                    <input type="radio" value={lang} checked={selectedLanguage === lang} onChange={(e) => handleLanguageChange(e.target.value)} className="mr-3 h-4 w-4 text-brand-dark focus:ring-brand-medium border-gray-300" />
                    <span className="text-gray-900 dark:text-white">
                      {lang === 'en' && 'English'}
                      {lang === 'hi' && 'हिंदी (Hindi)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div><h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><Bell className="w-5 h-5 mr-2" />{t('notifications', state.language)}</h2><div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-4"><div className="flex items-center justify-between"><div><span className="font-medium text-gray-900 dark:text-white">{t('checkinReminders', state.language)}</span><p className="text-sm text-gray-600 dark:text-gray-300">{t('checkinRemindersDesc', state.language)}</p></div><button onClick={() => dispatch({ type: 'SET_SHOW_DAILY_CHECK_IN', payload: !state.showDailyCheckIn })} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${state.showDailyCheckIn ? 'bg-brand-dark' : 'bg-gray-200'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${state.showDailyCheckIn ? 'translate-x-6' : 'translate-x-1'}`} /></button></div></div></div>
        </div>
      </div>
    </div>
  );
}
