import React, { useState, useEffect } from 'react';
import { X, Heart, AlertTriangle, Send } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';
import { sendEmergencyAlert } from '../../utils/aiService';

const MOOD_LABELS = [
  '😰 Terrible', '😞 Poor', '😐 Okay', '😊 Good', '😄 Great',
  '🤗 Amazing', '💪 Energetic', '😴 Tired', '🤒 Unwell', '😌 Peaceful'
];

const COMMON_SYMPTOMS = [
  'Fever', 'Headache', 'Nausea', 'Fatigue', 'Dizziness',
  'Chest pain', 'Shortness of breath', 'Stomach pain', 'Joint pain',
  'Insomnia', 'Loss of appetite', 'Cough', 'Sore throat'
];

export function DailyCheckInModal() {
  const { state, dispatch } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [mood, setMood] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [customSymptom, setCustomSymptom] = useState('');

  const today = format(new Date(), 'yyyy-MM-dd');

  // Check if user already checked in today
  useEffect(() => {
    if (state.isAuthenticated && state.user?.userType === 'patient') {
      const hasCheckedInToday = state.dailyCheckIns.some(
        checkIn => checkIn.userId === state.user?.id && checkIn.date === today
      );
      
      if (!hasCheckedInToday && state.showDailyCheckIn) {
        // Show modal after a short delay
        const timer = setTimeout(() => setIsOpen(true), 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [state.isAuthenticated, state.user, state.dailyCheckIns, today, state.showDailyCheckIn]);

  const handleSymptomToggle = (symptom: string) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const addCustomSymptom = () => {
    if (customSymptom.trim() && !selectedSymptoms.includes(customSymptom.trim())) {
      setSelectedSymptoms(prev => [...prev, customSymptom.trim()]);
      setCustomSymptom('');
    }
  };

  const detectRedFlags = (symptoms: string[], notes: string): string[] => {
    const redFlags = [];
    const allText = [...symptoms, notes].join(' ').toLowerCase();

    if (symptoms.some(s => ['chest pain', 'shortness of breath'].includes(s.toLowerCase()))) {
      redFlags.push('Cardiovascular symptoms');
    }
    if (allText.includes('severe') || allText.includes('unbearable')) {
      redFlags.push('Severe symptoms');
    }
    if (allText.includes('suicidal') || allText.includes('self-harm')) {
      redFlags.push('Mental health crisis');
    }
    if (mood <= 2) {
      redFlags.push('Very low mood');
    }

    return redFlags;
  };

  const handleSubmit = async () => {
    if (!state.user) return;

    const allSymptoms = [...selectedSymptoms];
    const redFlags = detectRedFlags(allSymptoms, notes);

    const checkIn = {
      id: Date.now().toString(),
      userId: state.user.id,
      date: today,
      mood,
      symptoms: allSymptoms,
      notes,
      redFlags,
      timestamp: new Date(),
    };

    dispatch({ type: 'ADD_CHECK_IN', payload: checkIn });

    // Send emergency alert if red flags detected
    if (redFlags.length > 0 && state.user.emergencyContact) {
      await sendEmergencyAlert(
        state.user.emergencyContact,
        state.user.emergencyContactName || 'Emergency Contact',
        state.user.name,
        redFlags
      );
    }

    setIsOpen(false);
    setMood(5);
    setSelectedSymptoms([]);
    setNotes('');
  };

  const handleSkip = () => {
    dispatch({ type: 'SET_SHOW_DAILY_CHECK_IN', payload: false });
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-pink-100 dark:bg-pink-900 rounded-lg">
                <Heart className="w-6 h-6 text-pink-600 dark:text-pink-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Daily Check-in
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  How are you feeling today?
                </p>
              </div>
            </div>
            <button
              onClick={handleSkip}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Mood Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How's your mood today? ({mood}/10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={mood}
              onChange={(e) => setMood(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span>😰 Poor</span>
              <span>😐 Okay</span>
              <span>😄 Great</span>
            </div>
          </div>

          {/* Symptoms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Any symptoms today?
            </label>
            <div className="grid grid-cols-2 gap-2 mb-3">
              {COMMON_SYMPTOMS.map(symptom => (
                <button
                  key={symptom}
                  onClick={() => handleSymptomToggle(symptom)}
                  className={`p-2 rounded-lg text-sm transition-colors ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
                  } border`}
                >
                  {symptom}
                </button>
              ))}
            </div>
            
            <div className="flex space-x-2">
              <input
                type="text"
                value={customSymptom}
                onChange={(e) => setCustomSymptom(e.target.value)}
                placeholder="Add custom symptom"
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addCustomSymptom()}
              />
              <button
                onClick={addCustomSymptom}
                className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Additional notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="How are you feeling overall? Any concerns?"
            />
          </div>

          {/* Red Flag Warning */}
          {(selectedSymptoms.some(s => ['Chest pain', 'Shortness of breath'].includes(s)) || mood <= 2) && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                <span className="text-red-700 dark:text-red-300 font-medium">
                  Health Alert
                </span>
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                Your symptoms may require immediate attention. Your emergency contact will be notified.
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-2 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Skip Today
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Submit Check-in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
