import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Shield, Calendar, Activity, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { format } from 'date-fns';

export function ShareView() {
  const { linkId } = useParams();
  const { state } = useApp();
  const [accessCode, setAccessCode] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [shareableLink, setShareableLink] = useState<any>(null);
  const [sharedUser, setSharedUser] = useState<any>(null);

  useEffect(() => {
    const link = state.shareableLinks.find(l => l.id === linkId);
    if (link) {
      setShareableLink(link);
      // In a real app, you'd fetch user data from backend
      // For demo, we'll simulate finding the user
      setSharedUser({
        name: 'Demo Patient',
        email: 'patient@example.com'
      });
    }
  }, [linkId, state.shareableLinks]);

  const handleAccessCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (shareableLink && accessCode.toUpperCase() === shareableLink.accessCode) {
      setIsAuthenticated(true);
    } else {
      alert('Invalid access code');
    }
  };

  if (!shareableLink) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Link Not Found
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            This shareable link is invalid or has expired.
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Secure Health Data Access
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Enter the access code to view {sharedUser?.name}'s health information
              </p>
            </div>

            <form onSubmit={handleAccessCodeSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Access Code
                </label>
                <input
                  type="text"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono uppercase"
                  placeholder="XXXXXX"
                  maxLength={6}
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Access Health Data
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // Show shared data
  const userTracks = state.tracks.filter(t => t.id.includes(shareableLink.userId));
  const userLogs = state.dailyLogs.filter(l => l.trackId && userTracks.some(t => t.id === l.trackId));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {sharedUser?.name}'s Health Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              Shared health information - View only
            </p>
          </div>
        </div>

        {/* Shared Data Sections */}
        <div className="space-y-6">
          {shareableLink.sharedData.tracks && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Medication Tracks
                  </h2>
                </div>
              </div>
              <div className="p-6">
                {userTracks.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No medication tracks to display
                  </p>
                ) : (
                  <div className="space-y-4">
                    {userTracks.map(track => (
                      <div key={track.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {track.condition}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">Start Date:</span>
                            <span className="ml-2 text-gray-900 dark:text-white">
                              {format(new Date(track.startDate), 'MMM d, yyyy')}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600 dark:text-gray-300">Status:</span>
                            <span className={`ml-2 px-2 py-1 rounded text-xs ${
                              track.isActive 
                                ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'
                                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                            }`}>
                              {track.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3">
                          <span className="text-gray-600 dark:text-gray-300">Medicines:</span>
                          <div className="mt-1 space-y-1">
                            {track.medicines.map(med => (
                              <div key={med.id} className="text-sm text-gray-900 dark:text-white">
                                {med.name} - {med.dosage} ({med.frequency})
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {shareableLink.sharedData.progress && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-3">
                  <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Progress Overview
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userTracks.filter(t => t.isActive).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Active Tracks
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userTracks.reduce((acc, t) => acc + t.medicines.length, 0)}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Total Medicines
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userTracks.length > 0 
                        ? Math.round(userTracks.reduce((acc, t) => acc + t.completionRate, 0) / userTracks.length)
                        : 0}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Avg. Completion
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {userLogs.filter(l => l.taken).length}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      Doses Taken
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            This is a secure, read-only view of shared health data. 
            Data is protected and access is logged for security purposes.
          </p>
        </div>
      </div>
    </div>
  );
}
