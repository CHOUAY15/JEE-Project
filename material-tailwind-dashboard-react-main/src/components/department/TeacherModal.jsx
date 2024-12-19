import React, { useState } from 'react';
import { useAppDispatch } from '../../app/hooks';
import { addTeacher } from '../../features/department/departmentSlice';

export const TeacherModal = ({ isOpen, onClose, departmentId }) => {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    department: departmentId
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTeacher({
      id: Date.now(),
      ...formData
    }));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Nouvel enseignant</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Nom</label>
            <input
              type="text"
              className="input"
              value={formData.lastName}
              onChange={e => setFormData({...formData, lastName: e.target.value})}
              placeholder="Nom de famille"
            />
          </div>

          <div>
            <label className="block mb-1">Prénom</label>
            <input
              type="text"
              className="input"
              value={formData.firstName}
              onChange={e => setFormData({...formData, firstName: e.target.value})}
              placeholder="Prénom"
            />
          </div>

          <div>
            <label className="block mb-1">Email</label>
            <input
              type="email"
              className="input"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="email@example.com"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full">
            Ajouter l'enseignant
          </button>
        </form>
      </div>
    </div>
  );
};