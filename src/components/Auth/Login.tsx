import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Lock, Heart, Stethoscope } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Login() {
  const [patientId, setPatientId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { state, dispatch } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const user = state.users.find(u => u.id === patientId && u.userType === 'patient');

    if (!user) {
      setError('Invalid Patient ID. Please check and try again.');
      return;
    }

    if (!user.isProfileComplete) {
      setError('Account not fully set up. Please sign up first.');
      return;
    }

    if (user.password !== password) {
      setError('Invalid password.');
      return;
    }

    dispatch({ type: 'LOGIN', payload: user });
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center">
              <Heart className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-brand-dark">Welcome to Arogya Sahayak</h2>
          <p className="mt-2 text-gray-600">Keep your health on track</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">
              Patient ID
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="patientId"
                type="text"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg"
                placeholder="Enter your Patient ID"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg"
                placeholder="Enter your password"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-dark text-white py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Sign In as Patient
          </button>

          <div className="text-center space-y-2">
            <div>
              <span className="text-gray-600">Don't have an account? </span>
              <Link to="/signup" className="text-brand-medium hover:text-brand-dark font-medium">
                Sign up
              </Link>
            </div>
            <div className="border-t pt-2">
              <Link to="/doctor/login" className="text-sm text-gray-500 hover:text-gray-700 font-medium flex items-center justify-center space-x-1">
                <Stethoscope className="w-4 h-4" />
                <span>Are you a Doctor? Login here.</span>
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
