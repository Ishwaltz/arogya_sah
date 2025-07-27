import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, User as UserIcon, Stethoscope, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Doctor } from '../../types';

export function DoctorLogin() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { state, dispatch } = useApp();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, you'd authenticate against a backend.
    // Here, we find the doctor by email or create a new profile if it doesn't exist.
    let doctor = state.doctors.find(d => d.email.toLowerCase() === email.toLowerCase());

    if (!doctor) {
      doctor = {
        id: 'doc_' + Date.now(),
        name: name,
        email: email,
        specialization: 'General Medicine', // Default specialization
        patients: [],
        licenseNumber: `DEMO-${Date.now()}`, // Demo license
      };
      dispatch({ type: 'ADD_DOCTOR', payload: doctor });
    } else {
      // If doctor exists, we might want to update their name if it's different
      if (doctor.name !== name) {
        doctor = { ...doctor, name };
        // You'd need an UPDATE_DOCTOR action for this in a real scenario
      }
    }

    // Log the user in
    dispatch({
      type: 'LOGIN',
      payload: {
        id: doctor.id,
        name: doctor.name,
        email: doctor.email,
        userType: 'doctor',
      },
    });
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-brand-dark">
            Doctor Portal
          </h2>
          <p className="mt-2 text-gray-600">
            Arogya Sahayak Healthcare Platform
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          <div className="flex items-center justify-center space-x-2 text-brand-medium">
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Secure Doctor Login</span>
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg"
                placeholder="Dr. John Doe"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg"
                placeholder="doctor@hospital.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-brand-dark text-white py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors"
          >
            Sign In as Doctor
          </button>

          <div className="text-center">
            <Link to="/login" className="text-brand-medium hover:text-brand-dark font-medium">
              Are you a Patient? Login here.
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
