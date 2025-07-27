import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { User, Plus, Search } from 'lucide-react';
import { User as UserType } from '../../types';

export function PatientListView() {
  const { state, dispatch } = useApp();
  const [newPatientName, setNewPatientName] = useState('');
  const [newPatientId, setNewPatientId] = useState(`PAT${Date.now().toString().slice(-6)}`);
  const [searchTerm, setSearchTerm] = useState('');

  const doctor = state.doctors.find(d => d.id === state.user?.id);
  const patientIds = doctor?.patients || [];
  const patients = state.users.filter(u => patientIds.includes(u.id));

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatientName.trim() || !newPatientId.trim()) {
      alert('Please provide a name and ID for the patient.');
      return;
    }
    if (state.users.some(u => u.id === newPatientId)) {
      alert('This Patient ID is already taken. Please use a different one.');
      return;
    }

    const newPatient: UserType = {
      id: newPatientId,
      name: newPatientName,
      userType: 'patient',
      assignedDoctor: state.user!.id,
      isProfileComplete: false,
    };

    dispatch({ type: 'ADD_PATIENT', payload: { patient: newPatient, doctorId: state.user!.id } });

    setNewPatientName('');
    setNewPatientId(`PAT${Date.now().toString().slice(-6)}`);
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Patient</h1>
        </div>
        <form onSubmit={handleAddPatient} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Patient Full Name</label>
              <input type="text" id="patientName" value={newPatientName} onChange={e => setNewPatientName(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium" />
            </div>
            <div>
              <label htmlFor="patientId" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Unique Patient ID</label>
              <input type="text" id="patientId" value={newPatientId} onChange={e => setNewPatientId(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium" />
            </div>
            <div className="self-end">
              <button type="submit" className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-brand-dark text-white rounded-lg hover:bg-opacity-90 transition-colors">
                <Plus className="w-5 h-5" />
                <span>Add Patient</span>
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Your Patients ({patients.length})</h1>
          <div className="relative w-1/3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input type="text" placeholder="Search by name or ID..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-medium" />
          </div>
        </div>
        <div className="p-6">
          {filteredPatients.length > 0 ? (
            <ul className="space-y-3">
              {filteredPatients.map(patient => (
                <li key={patient.id} className="p-4 border border-gray-200 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-brand-light/30 p-3 rounded-full">
                      <User className="w-6 h-6 text-brand-dark" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{patient.name}</p>
                      <p className="text-sm text-gray-500">ID: {patient.id}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${patient.isProfileComplete ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {patient.isProfileComplete ? 'Registered' : 'Pending Registration'}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-8">No patients found.</p>
          )}
        </div>
      </div>
    </div>
  );
}
