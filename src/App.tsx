import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Layout } from './components/Layout';
import { Login } from './components/Auth/Login';
import { Signup } from './components/Auth/Signup';
import { DoctorLogin } from './components/Auth/DoctorLogin';
import { Dashboard } from './components/Dashboard/Dashboard';
import { DoctorDashboard } from './components/Doctor/DoctorDashboard';
import { CalendarView } from './components/Calendar/CalendarView';
import { TracksView } from './components/Tracks/TracksView';
import { AddTrackView } from './components/AddTrack/AddTrackView';
import { ChatView } from './components/Chat/ChatView';
import { SettingsView } from './components/Settings/SettingsView';
import { DailyCheckInModal } from './components/Modals/DailyCheckInModal';
import { AddAppointmentView } from './components/Doctor/AddAppointmentView';
import { PatientListView } from './components/Doctor/PatientListView';

function ProtectedRoute({ children, isDoctorRoute = false }: { children: React.ReactNode, isDoctorRoute?: boolean }) {
  const { state } = useApp();
  if (!state.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (isDoctorRoute && state.user?.userType !== 'doctor') {
    return <Navigate to="/dashboard" />;
  }
  if (!isDoctorRoute && state.user?.userType === 'doctor') {
    return <Navigate to="/doctor/dashboard" />;
  }
  return <Layout>{children}</Layout>;
}

function AppRoutes() {
  const { state } = useApp();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={state.isAuthenticated ? 
            (state.user?.userType === 'doctor' ? <Navigate to="/doctor/dashboard" /> : <Navigate to="/dashboard" />) 
            : <Login />} 
        />
        <Route 
          path="/signup" 
          element={state.isAuthenticated ? <Navigate to="/dashboard" /> : <Signup />} 
        />
        <Route 
          path="/doctor/login" 
          element={state.isAuthenticated && state.user?.userType === 'doctor' ? <Navigate to="/doctor/dashboard" /> : <DoctorLogin />} 
        />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/dashboard" 
          element={
            <ProtectedRoute isDoctorRoute>
              <DoctorDashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/patients" 
          element={
            <ProtectedRoute isDoctorRoute>
              <PatientListView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/calendar" 
          element={
            <ProtectedRoute>
              <CalendarView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/tracks" 
          element={
            <ProtectedRoute>
              <TracksView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/add-track" 
          element={
            <ProtectedRoute isDoctorRoute>
              <AddTrackView />
            </ProtectedRoute>
          } 
        />
        <Route
          path="/doctor/add-appointment"
          element={
            <ProtectedRoute isDoctorRoute>
              <AddAppointmentView />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/chat" 
          element={
            <ProtectedRoute>
              <ChatView />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/settings" 
          element={
            <ProtectedRoute>
              <SettingsView />
            </ProtectedRoute>
          } 
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
      
      {state.isAuthenticated && state.user?.userType === 'patient' && <DailyCheckInModal />}
    </Router>
  );
}

function App() {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
}

export default App;
