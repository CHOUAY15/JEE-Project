import React, { useState, useEffect } from 'react';
import { useGetOptionsQuery, useCreateExamMutation, useUpdateExamMutation, useGetLocauxQuery } from '../../features/exam/examSlice';

export const ExamScheduler = ({ isOpen, onClose, date, timeSlot, sessionId, examToEdit }) => {
  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation();
  const { data: options = [] } = useGetOptionsQuery();
  const { data: locaux = [] } = useGetLocauxQuery();
  
  const [searchLocal, setSearchLocal] = useState('');
  const [typeLocal, setTypeLocal] = useState('');
  const [error, setError] = useState(null);
  const [selectedLocaux, setSelectedLocaux] = useState([]);
  
  const [formData, setFormData] = useState({
    optionId: '',
    moduleId: '',
    nombreEtudiants: ''
  });

  // Effet pour initialiser le formulaire en mode édition
  useEffect(() => {
    if (examToEdit) {
      console.log('Initialisation avec:', examToEdit);
      setFormData({
        optionId: examToEdit.option?.id || '',
        moduleId: examToEdit.moduleId || '',
        nombreEtudiants: examToEdit.nbEtudiants || ''
      });
      setSelectedLocaux(examToEdit.locaux || []); // IDs des locaux
    } else {
      // Réinitialiser le formulaire
      setFormData({
        optionId: '',
        moduleId: '',
        nombreEtudiants: ''
      });
      setSelectedLocaux([]);
    }
  }, [examToEdit]);

  const selectedOption = options.find(opt => opt.id === parseInt(formData.optionId));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (selectedLocaux.length === 0) {
      setError("Veuillez sélectionner au moins un local");
      return;
    }

    try {
      const examData = {
        ...(examToEdit?.id && { id: examToEdit.id }),
        session: {
          id: parseInt(sessionId)
        },
        departementId: selectedOption?.departementId || null,
        module: selectedOption?.modules?.find(m => m.id === parseInt(formData.moduleId))?.nom || '',
        date: date,
        horaire: timeSlot,
        nbEtudiants: parseInt(formData.nombreEtudiants),
        locaux: selectedLocaux
      };

      console.log('Données à envoyer:', examData);

      if (examToEdit) {
        await updateExam(examData).unwrap();
      } else {
        await createExam(examData).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.data?.message || "Une erreur est survenue");
    }
  };

  // Filtrer les locaux selon la recherche et le type
  const filteredLocaux = locaux.filter(local => {
    const matchSearch = local.nom.toLowerCase().includes(searchLocal.toLowerCase());
    const matchType = typeLocal ? local.type === typeLocal : true;
    return matchSearch && matchType;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            {examToEdit ? 'Modifier l\'examen' : 'Programmer un examen'}
            <div className="text-sm font-normal text-gray-600">
              {date} - {timeSlot}
            </div>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1">Option</label>
            <select 
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-black"
              value={formData.optionId}
              onChange={e => {
                setFormData({
                  ...formData,
                  optionId: e.target.value,
                  moduleId: '' // Réinitialiser le module lors du changement d'option
                });
              }}
              required
            >
              <option value="">Sélectionnez une option</option>
              {options.map(option => (
                <option key={option.id} value={option.id}>
                  {option.nomOption}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Module</label>
            <select 
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-black"
              value={formData.moduleId}
              onChange={e => setFormData({...formData, moduleId: e.target.value})}
              required
              disabled={!formData.optionId}
            >
              <option value="">Sélectionnez un module</option>
              {selectedOption?.modules?.map(module => (
                <option key={module.id} value={module.id}>
                  {module.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1">Locaux</label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Rechercher un local..."
                  value={searchLocal}
                  onChange={(e) => setSearchLocal(e.target.value)}
                  className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-black"
                />
                <select
                  value={typeLocal}
                  onChange={(e) => setTypeLocal(e.target.value)}
                  className="px-3 py-2 border rounded focus:ring-2 focus:ring-black"
                >
                  <option value="">Tous les types</option>
                  <option value="salle">Salle</option>
                  <option value="amphi">Amphi</option>
                </select>
              </div>
              <div className="max-h-40 overflow-y-auto border rounded p-2">
                {filteredLocaux.map(local => (
                  <div key={local.id} className="flex items-center p-1">
                    <input
                      type="checkbox"
                      id={`local-${local.id}`}
                      checked={selectedLocaux.includes(local.id)}
                      onChange={() => {
                        setSelectedLocaux(prev => {
                          if (prev.includes(local.id)) {
                            return prev.filter(id => id !== local.id);
                          } else {
                            return [...prev, local.id];
                          }
                        });
                      }}
                      className="mr-2"
                    />
                    <label htmlFor={`local-${local.id}`} className="flex-1 cursor-pointer">
                      {local.nom} ({local.type}) - Capacité: {local.capacite}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1">Nombre d'étudiants</label>
            <input
              type="number"
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-black"
              value={formData.nombreEtudiants}
              onChange={e => setFormData({...formData, nombreEtudiants: e.target.value})}
              min="1"
              required
            />
          </div>

          <button 
            type="submit" 
            className="w-full bg-black text-white py-2 px-4 rounded hover:bg-gray-800 
              transition-colors duration-200"
          >
            {examToEdit ? 'Mettre à jour' : 'Programmer l\'examen'}
          </button>
        </form>
      </div>
    </div>
  );
};