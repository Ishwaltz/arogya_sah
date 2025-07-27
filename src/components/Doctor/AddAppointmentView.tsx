import React, { useState } from 'react';
import { Calendar, User, Clock, StickyNote, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Appointment } from '../../types';

export function AddAppointmentView() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const doctor = state.doctors.find(d => d.id === state.user?.id);

  const [patientId, setPatientId] = useState('');
  const [title, setTitle] = useState('Follow-up Consultation');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientId || !title || !date || !time) {
      alert('Please fill in all required fields.');
      return;
    }

    const [year, month, day] = date.split('-').map(Number);
    const [hours, minutes] = time.split(':').map(Number);
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);

    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId,
      doctorId: state.user!.id,
      title,
      date: appointmentDate,
      notes,
    };

    dispatch({ type: 'ADD_APPOINTMENT', payload: newAppointment });
    alert('Appointment scheduled successfully!');
    navigate('/doctor/dashboard');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Calendar className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schedule Appointment</h1>
            <p className="text-gray-600">Book a new appointment for a patient</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div>
          <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <select id="patient" required value={patientId} onChange={(e) => setPatientId(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg">
              <option value="">-- Choose a patient --</option>
              {doctor?.patients.map(pId => {
                const patientUser = { id: pId, name: `Patient ${pId.slice(-4)}` };
                return <option key={patientUser.id} value={patientUser.id}>{patientUser.name}</option>;
              })}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">Appointment Title *</label>
          <input id="title" type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" placeholder="e.g., Follow-up Consultation" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input id="date" type="date" required value={date} onChange={(e) => setDate(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" />
            </div>
          </div>
          <div>
            <label htmlFor="time" className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input id="time" type="time" required value={time} onChange={(e) => setTime(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" />
            </div>
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
          <div className="relative">
            <StickyNote className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
            <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" placeholder="e.g., Discuss recent lab results."></textarea>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="flex items-center space-x-2 px-8 py-3 bg-purple-600 text-white rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors">
            <Plus />
            <span>Schedule Appointment</span>
          </button>
        </div>
      </form>
    </div>
  );
}
