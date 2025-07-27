import React, { useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, List, Plus, MessageCircle, Settings, LogOut, User, Moon, Sun, Users, CalendarClock, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { isToday, isTomorrow, format } from 'date-fns';
import { Logo } from './Logo';

interface LayoutProps {
  children: React.ReactNode;
}

function AppointmentBanner() {
  const { state } = useApp();
  const navigate = useNavigate();

  const upcomingAppointments = useMemo(() => {
    if (state.user?.userType !== 'patient') return [];
    return state.appointments
      .filter(appt => appt.patientId === state.user?.id && (isToday(appt.date) || isTomorrow(appt.date)))
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [state.appointments, state.user]);

  if (upcomingAppointments.length === 0) return null;

  const handleBannerClick = () => {
    navigate('/calendar');
  };

  return (
    <div 
      onClick={handleBannerClick}
      className="bg-brand-light/50 border-b border-brand-light text-brand-dark py-2 px-4 text-center text-sm cursor-pointer hover:bg-brand-light/80 transition-colors"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center space-x-2">
        <Bell className="w-4 h-4" />
        <span>
          Reminder: You have an appointment {isToday(upcomingAppointments[0].date) ? `today at ${format(upcomingAppointments[0].date, 'p')}` : `tomorrow at ${format(upcomingAppointments[0].date, 'p')}`}.
        </span>
      </div>
    </div>
  );
}

export function Layout({ children }: LayoutProps) {
  const { state, dispatch } = useApp();
  const location = useLocation();

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const toggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  const patientNavItems = [
    { path: '/dashboard', icon: Home, label: t('home', state.language) },
    { path: '/calendar', icon: Calendar, label: t('calendar', state.language) },
    { path: '/chat', icon: MessageCircle, label: t('chat', state.language) },
  ];

  const doctorNavItems = [
    { path: '/doctor/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/doctor/patients', icon: Users, label: 'Patients' },
    { path: '/add-track', icon: Plus, label: t('addTrack', state.language) },
    { path: '/doctor/add-appointment', icon: CalendarClock, label: 'Appointments' },
  ];

  const navItems = state.user?.userType === 'doctor' ? doctorNavItems : patientNavItems;

  return (
    <div className="min-h-screen bg-brand-background dark:bg-gray-900 transition-colors">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Logo />
            </div>
            
            <div className="flex items-center space-x-4">
              <button onClick={toggleTheme} className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                {state.theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
                <User className="w-4 h-4" />
                <span>{state.user?.name}</span>
                <span className={`px-2 py-1 text-white rounded text-xs capitalize ${state.user?.userType === 'doctor' ? 'bg-brand-dark' : 'bg-brand-medium'}`}>{state.user?.userType}</span>
              </div>
              
              <Link to="/settings" className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"><Settings className="w-4 h-4" /></Link>
              
              <button onClick={handleLogout} className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 transition-colors">
                <LogOut className="w-4 h-4" />
                <span>{t('logout', state.language)}</span>
              </button>
            </div>
          </div>
        </div>
        <AppointmentBanner />
      </header>

      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8 overflow-x-auto">
            {navItems.map(({ path, icon: Icon, label }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  location.pathname === path
                    ? 'border-brand-dark text-brand-dark dark:border-brand-light dark:text-brand-light'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
