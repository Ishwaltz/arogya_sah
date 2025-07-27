export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  frequency: string; // e.g., "2 times daily", "Every 8 hours"
  timings: string[]; // e.g., ["08:00", "20:00"]
  instructions?: string;
}

export interface MedicineTrack {
  id: string;
  patientId: string; // ID of the patient this track belongs to
  condition: string;
  medicines: Medicine[];
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  completionRate: number;
  assignedBy?: string; // Doctor ID if assigned by doctor
  notes?: string;
}

export interface Appointment {
  id:string;
  patientId: string;
  doctorId: string;
  title: string;
  date: Date;
  notes?: string;
}

export interface DailyLog {
  date: string; // YYYY-MM-DD format
  medicineId: string;
  trackId: string;
  timing: string;
  taken: boolean;
  takenAt?: Date;
}

export interface User {
  id: string; // For patients, this is their Patient ID. For doctors, their unique ID.
  name: string;
  email?: string; // Required for doctors, optional for patients
  password?: string; // Added for patient login
  age?: number;
  emergencyContact?: string;
  emergencyContactName?: string;
  userType: 'patient' | 'doctor';
  assignedDoctor?: string; // Doctor ID for patients
  language?: string;
  isProfileComplete?: boolean; // To check if patient has signed up
}

export interface Doctor {
  id: string;
  name: string;
  email: string;
  specialization: string;
  patients: string[]; // Patient IDs
  licenseNumber: string;
}

export interface DailyCheckIn {
  id: string;
  userId: string;
  date: string;
  mood: number; // 1-10 scale
  symptoms: string[];
  notes: string;
  redFlags: string[];
  timestamp: Date;
}

export interface ChatMessage {
  id: string;
  userId: string;
  message: string;
  response: string;
  timestamp: Date;
  isRedFlag?: boolean;
}

export interface AppState {
  user: User | null;
  users: User[]; // Store all users, including patient shells
  tracks: MedicineTrack[];
  dailyLogs: DailyLog[];
  doctors: Doctor[];
  appointments: Appointment[];
  dailyCheckIns: DailyCheckIn[];
  chatHistory: ChatMessage[];
  isAuthenticated: boolean;
  theme: 'light' | 'dark';
  language: string;
  showDailyCheckIn: boolean;
}
