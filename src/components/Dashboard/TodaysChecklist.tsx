import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Circle, Clock, AlertTriangle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function TodaysChecklist() {
  const { state, dispatch } = useApp();
  const today = format(new Date(), 'yyyy-MM-dd');
  const currentTime = new Date();

  // Get today's medications for the logged-in patient
  const todaysMedications = state.tracks
    .filter(track => track.isActive && track.patientId === state.user?.id)
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
              log.date === today &&
              log.medicineId === medicine.id &&
              log.timing === timing &&
              log.taken
          ),
        }))
      )
    )
    .sort((a, b) => a.timing.localeCompare(b.timing));

  const handleToggleMedicine = (medicineId: string, timing: string, trackId: string) => {
    const existingLog = state.dailyLogs.find(
      log =>
        log.date === today &&
        log.medicineId === medicineId &&
        log.timing === timing
    );

    dispatch({
      type: 'LOG_MEDICINE',
      payload: {
        date: today,
        medicineId,
        trackId,
        timing,
        taken: !existingLog?.taken,
        takenAt: !existingLog?.taken ? new Date() : undefined,
      },
    });
  };

  const getTimingStatus = (timing: string, taken: boolean) => {
    const [hours, minutes] = timing.split(':').map(Number);
    const scheduledTime = new Date(currentTime);
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (taken) return 'taken';
    if (currentTime < scheduledTime) return 'upcoming';
    if (currentTime.getTime() - scheduledTime.getTime() > 30 * 60 * 1000) return 'overdue';
    return 'due';
  };

  if (todaysMedications.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No medications scheduled today</h3>
        <p className="text-gray-600">You're all set for today! Your doctor has not assigned any medications.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {todaysMedications.map((med, index) => {
        const status = getTimingStatus(med.timing, med.taken);
        
        return (
          <div
            key={`${med.medicineId}-${med.timing}-${index}`}
            className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
              med.taken
                ? 'bg-green-50 border-green-200'
                : status === 'overdue'
                ? 'bg-red-50 border-red-200'
                : status === 'due'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-4">
              <button
                onClick={() => handleToggleMedicine(med.medicineId, med.timing, med.trackId)}
                className={`p-2 rounded-full transition-colors ${
                  med.taken
                    ? 'text-green-600 hover:text-green-700'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {med.taken ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
              </button>
              
              <div>
                <h4 className="font-semibold text-gray-900">{med.medicineName}</h4>
                <p className="text-sm text-gray-600">{med.dosage} • {med.condition}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="font-medium text-gray-900">{med.timing}</p>
                <p className={`text-xs font-medium ${
                  status === 'taken' ? 'text-green-600' :
                  status === 'overdue' ? 'text-red-600' :
                  status === 'due' ? 'text-yellow-600' :
                  'text-gray-500'
                }`}>
                  {status === 'taken' ? 'Completed' :
                   status === 'overdue' ? 'Overdue' :
                   status === 'due' ? 'Due now' :
                   'Upcoming'}
                </p>
              </div>
              
              {status === 'overdue' && (
                <AlertTriangle className="w-5 h-5 text-red-500" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
