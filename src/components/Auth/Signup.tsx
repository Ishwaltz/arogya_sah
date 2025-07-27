import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, Heart } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export function Signup() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const [patientId, setPatientId] = useState('');
  const [patientExists, setPatientExists] = useState<boolean | null>(null);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    age: '',
    emergencyContact: '',
  });

  useEffect(() => {
    if (patientId) {
      const user = state.users.find(u => u.id === patientId && u.userType === 'patient');
      if (user) {
        if (user.isProfileComplete) {
          setError('This Patient ID is already registered. Please log in.');
          setPatientExists(false);
        } else {
          setPatientExists(true);
          setFormData(prev => ({ ...prev, name: user.name }));
          setError('');
        }
      } else {
        setPatientExists(false);
        setError('Invalid Patient ID. Please get a valid ID from your doctor.');
      }
    } else {
      setPatientExists(null);
      setError('');
    }
  }, [patientId, state.users]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientExists) {
      setError('Please enter a valid Patient ID provided by your doctor.');
      return;
    }

    const existingUser = state.users.find(u => u.id === patientId)!;
    const updatedUser = {
      ...existingUser,
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined,
      password: formData.password,
      isProfileComplete: true,
    };

    dispatch({ type: 'UPDATE_USER', payload: updatedUser });
    dispatch({ type: 'LOGIN', payload: updatedUser });
    
    navigate('/dashboard');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-brand-background flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center"><div className="w-16 h-16 bg-brand-dark rounded-2xl flex items-center justify-center"><Heart className="w-8 h-8 text-white" /></div></div>
          <h2 className="mt-6 text-3xl font-bold text-brand-dark">Create Patient Account</h2>
          <p className="mt-2 text-gray-600">Complete your registration</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg space-y-6">
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <div>
            <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 mb-2">Patient ID *</label>
            <div className="relative"><User className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="patientId" type="text" required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg" placeholder="Enter ID from your doctor" /></div>
          </div>

          {patientExists && (
            <>
              <div><label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label><div className="relative"><User className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg" placeholder="Enter your full name" /></div></div>
              <div><label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address (Optional)</label><div className="relative"><Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg" placeholder="Enter your email" /></div></div>
              <div><label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Create Password *</label><div className="relative"><Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg" placeholder="Create a secure password" /></div></div>
              <div className="grid grid-cols-2 gap-4">
                <div><label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">Age</label><input id="age" name="age" type="number" value={formData.age} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg" placeholder="Age" /></div>
                <div><label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label><div className="relative"><Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" /><input id="emergencyContact" name="emergencyContact" type="tel" value={formData.emergencyContact} onChange={handleChange} className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium focus:border-transparent text-lg" placeholder="Phone" /></div></div>
              </div>
              <button type="submit" className="w-full bg-brand-dark text-white py-3 rounded-lg text-lg font-medium hover:bg-opacity-90 transition-colors">Create Account</button>
            </>
          )}

          <div className="text-center"><span className="text-gray-600">Already have an account? </span><Link to="/login" className="text-brand-medium hover:text-brand-dark font-medium">Sign in</Link></div>
        </form>
      </div>
    </div>
  );
}
