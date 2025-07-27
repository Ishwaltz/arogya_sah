import React, { useState } from 'react';
import { Plus, X, Clock, Pill, User, StickyNote } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicineTrack, Medicine } from '../../types';
import { format } from 'date-fns';
import { commonMedicines } from '../../data/commonMedicines';
import { useNavigate } from 'react-router-dom';

export function AddTrackView() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  
  const doctor = state.doctors.find(d => d.id === state.user?.id);
  const patients = state.user?.userType === 'doctor' ? state.doctors.find(d => d.id === state.user.id)?.patients.map(pId => state.user) || [] : [];

  const [patientId, setPatientId] = useState('');
  const [condition, setCondition] = useState('');
  const [startDate, setStartDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const [medicines, setMedicines] = useState<Partial<Medicine>[]>([
    { name: '', dosage: '', frequency: '', timings: [''], instructions: '' },
  ]);

  const addMedicine = () => setMedicines([...medicines, { name: '', dosage: '', frequency: '', timings: [''], instructions: '' }]);
  const removeMedicine = (index: number) => { if (medicines.length > 1) setMedicines(medicines.filter((_, i) => i !== index)); };
  const updateMedicine = (index: number, field: keyof Medicine, value: any) => {
    const updated = [...medicines];
    updated[index] = { ...updated[index], [field]: value };
    setMedicines(updated);
  };
  const addTiming = (medIndex: number) => {
    const updated = [...medicines];
    updated[medIndex] = { ...updated[medIndex], timings: [...(updated[medIndex].timings || []), ''] };
    setMedicines(updated);
  };
  const removeTiming = (medIndex: number, timeIndex: number) => {
    const updated = [...medicines];
    const timings = updated[medIndex].timings || [];
    if (timings.length > 1) {
      updated[medIndex] = { ...updated[medIndex], timings: timings.filter((_, i) => i !== timeIndex) };
      setMedicines(updated);
    }
  };
  const updateTiming = (medIndex: number, timeIndex: number, value: string) => {
    const updated = [...medicines];
    const timings = [...(updated[medIndex].timings || [])];
    timings[timeIndex] = value;
    updated[medIndex] = { ...updated[medIndex], timings };
    setMedicines(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!condition || !patientId || medicines.some(med => !med.name || !med.dosage || !med.frequency)) {
      alert('Please fill in all required fields, including patient, condition, and medicine details.');
      return;
    }

    const track: MedicineTrack = {
      id: Date.now().toString(),
      patientId,
      condition,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
      isActive: true,
      completionRate: 0,
      medicines: medicines.map(med => ({
        id: Date.now().toString() + Math.random(),
        name: med.name!,
        dosage: med.dosage!,
        frequency: med.frequency!,
        timings: med.timings!.filter(timing => timing),
        instructions: med.instructions,
      })),
      assignedBy: state.user!.id,
      notes,
    };

    dispatch({ type: 'ADD_TRACK', payload: track });
    alert('Prescription track created successfully!');
    navigate('/tracks');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Plus className="w-6 h-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create New Prescription</h1>
            <p className="text-gray-600">Assign a new medication track to a patient</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Track Information</h2>
          
          <div>
            <label htmlFor="patient" className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <select
                id="patient"
                required
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              >
                <option value="">-- Choose a patient --</option>
                {doctor?.patients.map(pId => {
                  // In a real app, you'd fetch full patient objects. Here we simulate.
                  const patientUser = { id: pId, name: `Patient ${pId.slice(-4)}` };
                  return (
                    <option key={patientUser.id} value={patientUser.id}>
                      {patientUser.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
              Health Condition / Track Name *
            </label>
            <input id="condition" type="text" required value={condition} onChange={(e) => setCondition(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" placeholder="e.g., Hypertension, Post-Op Knee Recovery" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label><input id="startDate" type="date" required value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" /></div>
            <div><label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label><input id="endDate" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" /></div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
              Surgery Details / General Notes
            </label>
            <div className="relative">
              <StickyNote className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
              <textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg" placeholder="e.g., Right knee arthroscopy on Jan 15, 2025. Follow up in 2 weeks."></textarea>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between"><h2 className="text-lg font-semibold text-gray-900">Medications</h2><button type="button" onClick={addMedicine} className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"><Plus className="w-4 h-4" /><span>Add Medicine</span></button></div>
          {medicines.map((medicine, medIndex) => (
            <div key={medIndex} className="p-6 border-2 border-gray-200 rounded-xl space-y-4">
              <div className="flex items-center justify-between"><div className="flex items-center space-x-2"><Pill className="w-5 h-5 text-blue-600" /><h3 className="font-medium text-gray-900">Medicine {medIndex + 1}</h3></div>{medicines.length > 1 && (<button type="button" onClick={() => removeMedicine(medIndex)} className="p-1 text-red-500 hover:text-red-700 transition-colors"><X className="w-5 h-5" /></button>)}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name *</label>
                  <input list="medicines-list" type="text" required value={medicine.name || ''} onChange={(e) => updateMedicine(medIndex, 'name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Metformin" />
                  <datalist id="medicines-list">
                    {commonMedicines.map(med => <option key={med} value={med} />)}
                  </datalist>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Dosage *</label><input type="text" required value={medicine.dosage || ''} onChange={(e) => updateMedicine(medIndex, 'dosage', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., 500mg" /></div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Frequency *</label><select required value={medicine.frequency || ''} onChange={(e) => updateMedicine(medIndex, 'frequency', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"><option value="">Select frequency</option><option value="Once daily">Once daily</option><option value="Twice daily">Twice daily</option><option value="Three times daily">Three times daily</option><option value="As needed">As needed</option></select></div>
              <div>
                <div className="flex items-center justify-between mb-2"><label className="block text-sm font-medium text-gray-700">Daily Timings *</label><button type="button" onClick={() => addTiming(medIndex)} className="flex items-center space-x-1 text-sm text-blue-600 hover:text-blue-700"><Clock className="w-4 h-4" /><span>Add Time</span></button></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(medicine.timings || ['']).map((timing, timeIndex) => (
                    <div key={timeIndex} className="flex items-center space-x-1"><input type="time" required value={timing} onChange={(e) => updateTiming(medIndex, timeIndex, e.target.value)} className="flex-1 px-2 py-1 border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm" />{(medicine.timings || []).length > 1 && (<button type="button" onClick={() => removeTiming(medIndex, timeIndex)} className="p-1 text-red-500 hover:text-red-700 transition-colors"><X className="w-3 h-3" /></button>)}</div>
                  ))}
                </div>
              </div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Instructions (Optional)</label><textarea value={medicine.instructions || ''} onChange={(e) => updateMedicine(medIndex, 'instructions', e.target.value)} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="e.g., Take with food" /></div>
            </div>
          ))}
        </div>
        <div className="flex justify-end"><button type="submit" className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-medium hover:bg-green-700 transition-colors">Create Prescription</button></div>
      </form>
    </div>
  );
}
