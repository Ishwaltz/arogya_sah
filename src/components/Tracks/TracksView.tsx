import React, { useState } from 'react';
import { Target, ChevronDown, ChevronUp, Calendar, Pill, TrendingUp, User } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

export function TracksView() {
  const { state } = useApp();
  const [expandedTrack, setExpandedTrack] = useState<string | null>(null);

  const toggleTrack = (trackId: string) => {
    setExpandedTrack(expandedTrack === trackId ? null : trackId);
  };

  // Filter tracks based on user type
  const tracks = state.user?.userType === 'doctor' 
    ? state.tracks 
    : state.tracks.filter(track => track.patientId === state.user?.id);
    
  // Helper to get patient name from ID
  const getPatientName = (patientId: string) => {
    const patient = state.users.find(u => u.id === patientId);
    return patient ? patient.name : `Patient ID: ${patientId}`;
  };

  if (tracks.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No medication tracks found</h2>
          <p className="text-gray-600 mb-6">
            {state.user?.userType === 'doctor' 
              ? 'Create a new prescription to see it here.'
              : 'Your doctor has not assigned any medication tracks to you yet.'
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medication Tracks</h1>
              <p className="text-gray-600">Monitor medication progress and compliance</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="space-y-4">
            {tracks.map(track => (
              <div
                key={track.id}
                className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-gray-300 transition-colors"
              >
                <div
                  className="p-6 cursor-pointer"
                  onClick={() => toggleTrack(track.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-xl ${
                        track.isActive ? 'bg-green-100' : 'bg-gray-100'
                      }`}>
                        <Pill className={`w-6 h-6 ${
                          track.isActive ? 'text-green-600' : 'text-gray-400'
                        }`} />
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{track.condition}</h3>
                        {state.user?.userType === 'doctor' && (
                          <p className="text-sm text-brand-dark font-medium flex items-center mt-1">
                            <User className="w-4 h-4 mr-1.5" />
                            {getPatientName(track.patientId)}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 mt-1">
                          <span className="text-sm text-gray-600 flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            Started {format(new Date(track.startDate), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          track.completionRate >= 90
                            ? 'bg-green-100 text-green-700'
                            : track.completionRate >= 70
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {track.completionRate.toFixed(0)}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Completion rate</p>
                      </div>
                      
                      <div className={`p-2 rounded-lg ${
                        track.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {expandedTrack === track.id ? <ChevronUp /> : <ChevronDown />}
                      </div>
                    </div>
                  </div>
                </div>

                {expandedTrack === track.id && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="pt-4">
                      <h4 className="font-semibold text-gray-900 mb-3">Medications</h4>
                      <div className="space-y-3">
                        {track.medicines.map(medicine => (
                          <div
                            key={medicine.id}
                            className="p-4 bg-gray-50 rounded-lg"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">{medicine.name}</h5>
                                <p className="text-sm text-gray-600 mt-1">{medicine.dosage}</p>
                                <p className="text-sm text-gray-600">{medicine.frequency}</p>
                                {medicine.instructions && (
                                  <p className="text-sm text-gray-500 mt-1 italic">
                                    {medicine.instructions}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">
                                  {medicine.timings.length} time{medicine.timings.length !== 1 ? 's' : ''} daily
                                </p>
                                <div className="flex space-x-1 mt-1">
                                  {medicine.timings.map((timing, index) => (
                                    <span
                                      key={index}
                                      className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                    >
                                      {timing}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
