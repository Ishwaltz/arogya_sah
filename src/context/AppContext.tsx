import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AppState, MedicineTrack, DailyLog, User, Doctor, DailyCheckIn, ChatMessage, Appointment } from '../types';

type Action =
  | { type: 'LOGIN'; payload: User }
  | { type: 'LOGOUT' }
  | { type: 'ADD_PATIENT'; payload: { patient: User; doctorId: string } }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'ADD_TRACK'; payload: MedicineTrack }
  | { type: 'UPDATE_TRACK'; payload: MedicineTrack }
  | { type: 'DELETE_TRACK'; payload: string }
  | { type: 'LOG_MEDICINE'; payload: DailyLog }
  | { type: 'ADD_DOCTOR'; payload: Doctor }
  | { type: 'ADD_APPOINTMENT'; payload: Appointment }
  | { type: 'ADD_CHECK_IN'; payload: DailyCheckIn }
  | { type: 'ADD_CHAT_MESSAGE'; payload: ChatMessage }
  | { type: 'TOGGLE_THEME' }
  | { type: 'SET_LANGUAGE'; payload: string }
  | { type: 'SET_SHOW_DAILY_CHECK_IN'; payload: boolean }
  | { type: 'LOAD_DATA'; payload: Partial<AppState> };

const initialState: AppState = {
  user: null,
  users: [], // Start with empty users, will be populated by doctors or signup
  tracks: [],
  dailyLogs: [],
  doctors: [
    { id: 'doc_1', name: 'Emily Carter', email: 'emily.carter@clinic.com', specialization: 'Cardiology', patients: [], licenseNumber: 'DOC001' },
    { id: 'doc_2', name: 'Ben Adams', email: 'ben.adams@clinic.com', specialization: 'General Medicine', patients: [], licenseNumber: 'DOC002' },
  ],
  appointments: [],
  dailyCheckIns: [],
  chatHistory: [],
  isAuthenticated: false,
  theme: 'light',
  language: 'en',
  showDailyCheckIn: true,
};

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.payload, isAuthenticated: true };
    case 'LOGOUT':
      // Preserve all data, only clear session
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        showDailyCheckIn: true,
      };
    case 'ADD_PATIENT': {
      const { patient, doctorId } = action.payload;
      // Avoid adding patient with duplicate ID
      if (state.users.some(u => u.id === patient.id)) {
        return state;
      }
      return {
        ...state,
        users: [...state.users, patient],
        doctors: state.doctors.map(doc =>
          doc.id === doctorId ? { ...doc, patients: [...doc.patients, patient.id] } : doc
        ),
      };
    }
    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(u => u.id === action.payload.id ? action.payload : u),
        user: state.user?.id === action.payload.id ? action.payload : state.user,
      };
    case 'ADD_TRACK':
      return { ...state, tracks: [...state.tracks, action.payload] };
    case 'UPDATE_TRACK':
      return { ...state, tracks: state.tracks.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TRACK':
      return { ...state, tracks: state.tracks.filter(t => t.id !== action.payload) };
    case 'LOG_MEDICINE':
      return {
        ...state,
        dailyLogs: [...state.dailyLogs.filter(log => !(log.medicineId === action.payload.medicineId && log.date === action.payload.date && log.timing === action.payload.timing)), action.payload],
      };
    case 'ADD_DOCTOR':
      if (state.doctors.some(doc => doc.email === action.payload.email)) return state;
      return { ...state, doctors: [...state.doctors, action.payload] };
    case 'ADD_APPOINTMENT':
      return { ...state, appointments: [...state.appointments, action.payload] };
    case 'ADD_CHECK_IN':
      return { ...state, dailyCheckIns: [...state.dailyCheckIns, action.payload] };
    case 'ADD_CHAT_MESSAGE': {
      const existingIndex = state.chatHistory.findIndex(chat => chat.id === action.payload.id);
      if (existingIndex > -1) {
        // Update the existing message with the AI response
        const updatedChatHistory = [...state.chatHistory];
        updatedChatHistory[existingIndex] = action.payload;
        return { ...state, chatHistory: updatedChatHistory };
      } else {
        // Add the new optimistic message
        return { ...state, chatHistory: [...state.chatHistory, action.payload] };
      }
    }
    case 'TOGGLE_THEME':
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    case 'SET_SHOW_DAILY_CHECK_IN':
      return { ...state, showDailyCheckIn: action.payload };
    case 'LOAD_DATA':
      return { ...state, ...action.payload };
    default:
      return state;
  }
}

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedData = localStorage.getItem('arogyaSahayakData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        // Date object hydration
        ['tracks', 'appointments', 'dailyCheckIns', 'chatHistory'].forEach(key => {
          if (parsedData[key]) {
            parsedData[key] = parsedData[key].map((item: any) => ({
              ...item,
              ...(item.startDate && { startDate: new Date(item.startDate) }),
              ...(item.endDate && { endDate: new Date(item.endDate) }),
              ...(item.date && { date: new Date(item.date) }),
              ...(item.timestamp && { timestamp: new Date(item.timestamp) }),
            }));
          }
        });
        dispatch({ type: 'LOAD_DATA', payload: parsedData });
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('arogyaSahayakData', JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', state.theme === 'dark');
    if (state.theme === 'light') {
      document.body.style.backgroundColor = '#F2EFE7';
    } else {
      document.body.style.backgroundColor = '#111827'; // gray-900
    }
  }, [state.theme]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
