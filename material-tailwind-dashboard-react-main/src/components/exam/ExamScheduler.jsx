import React, { useState, useEffect } from 'react';
import { useGetOptionsQuery, useCreateExamMutation, useUpdateExamMutation, 
         useGetLocauxQuery, useGetExamsQuery } from '../../features/exam/examSlice';
import { Loader2 } from "lucide-react";

export const ExamScheduler = ({ isOpen, onClose, date, timeSlot, sessionId, examToEdit, isNewExam }) => {

  const [createExam] = useCreateExamMutation();
  const [updateExam] = useUpdateExamMutation();
  const { data: options = [] } = useGetOptionsQuery();
  const { data: locaux = [] } = useGetLocauxQuery();
  const { data: existingExams = [] } = useGetExamsQuery(
    { sessionId, date, horaire: timeSlot },
    { skip: !sessionId }
  );
  
  const [formData, setFormData] = useState({
    optionId: '',
    moduleId: '',
    nombreEtudiants: ''
  });
  
  const [searchLocal, setSearchLocal] = useState('');
  const [typeLocal, setTypeLocal] = useState('');
  const [error, setError] = useState(null);
  const [selectedLocaux, setSelectedLocaux] = useState([]);
  const [localAssignmentMode, setLocalAssignmentMode] = useState('auto');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (isOpen && isNewExam) {
      resetForm();
    }else if (examToEdit) {
      console.log('🔍 Starting exam edit initialization...');
      console.log('📝 Exam to edit:', examToEdit);
      console.log('📚 Available options:', options);
  
      // Find matching option and module
      let foundOption = null;
      let foundModule = null;
  
      // Search through options to find the matching module
      for (const option of options) {
        console.log(`\n🔎 Checking option: ${option.nomOption}`);
        console.log('📋 Modules in this option:', option.modules);
  
        const matchingModule = option.modules?.find(m => {
          console.log(`Comparing: "${m.nom}" with "${examToEdit.module}"`);
          return m.nom === examToEdit.module;
        });
  
        if (matchingModule) {
          console.log('✅ Found match!');
          console.log('Option:', option.nomOption);
          console.log('Module:', matchingModule.nom);
          foundOption = option;
          foundModule = matchingModule;
          break;
        }
      }
  
      if (foundOption && foundModule) {
        console.log('💾 Setting form data with:', {
          optionId: foundOption.id,
          moduleId: foundModule.id,
          nombreEtudiants: examToEdit.nbEtudiants
        });
  
        setFormData({
          optionId: foundOption.id.toString(),
          moduleId: foundModule.id.toString(),
          nombreEtudiants: examToEdit.nbEtudiants?.toString() || ''
        });
      } else {
        console.warn('❌ No matching option/module found for:', examToEdit.module);
      }
  
      // Set locaux
      if (Array.isArray(examToEdit.locaux)) {
        console.log('📍 Setting locaux:', examToEdit.locaux);
        setSelectedLocaux(examToEdit.locaux);
        setLocalAssignmentMode('manual');
      } else {
        console.warn('⚠️ No locaux array found in exam data');
      }
    } else {
      console.log('🔄 Resetting form - no exam to edit');
      resetForm();
    }
  }, [isOpen, isNewExam, examToEdit, options]);

  const resetForm = () => {
    setFormData({
      optionId: '',
      moduleId: '',
      nombreEtudiants: ''
    });
    setSelectedLocaux([]);
    setLocalAssignmentMode('auto');
    setValidationErrors({});
    setSearchLocal('');
    setTypeLocal('');
    setError(null);
  };
  const getAvailableLocaux = () => {
    const usedLocauxIds = existingExams
      .filter(exam => exam.id !== examToEdit?.id)
      .flatMap(exam => exam.locaux || []);

    return locaux.filter(local => !usedLocauxIds.includes(local.id));
  };

  const availableLocaux = getAvailableLocaux();
  const filteredLocaux = availableLocaux.filter(local => {
    const matchSearch = local.nom.toLowerCase().includes(searchLocal.toLowerCase());
    const matchType = typeLocal ? local.type === typeLocal : true;
    return matchSearch && matchType;
  });

  const selectedOption = options.find(opt => opt.id === parseInt(formData.optionId));
  const selectedModule = selectedOption?.modules?.find(m => m.id === parseInt(formData.moduleId));

  const autoAssignLocaux = (studentCount) => {
    if (!formData.optionId) {
      setValidationErrors(prev => ({
        ...prev,
        option: "Veuillez d'abord sélectionner une option"
      }));
      return [];
    }

    const count = parseInt(studentCount);
    if (!count) return [];

    const amphis = availableLocaux
      .filter(local => local.type === 'amphi')
      .sort((a, b) => b.capacite - a.capacite);

    const salles = availableLocaux
      .filter(local => local.type === 'salle')
      .sort((a, b) => b.capacite - a.capacite);

    const assigned = [];
    let remainingStudents = count;

    for (const amphi of amphis) {
      if (remainingStudents <= 0) break;
      if (remainingStudents >= amphi.capacite * 0.7) {
        assigned.push(amphi.id);
        remainingStudents -= amphi.capacite;
      }
    }

    for (const salle of salles) {
      if (remainingStudents <= 0) break;
      assigned.push(salle.id);
      remainingStudents -= salle.capacite;
    }

    return assigned;
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.optionId) {
      errors.option = "Veuillez sélectionner une option";
    }
    
    if (!formData.moduleId) {
      errors.module = "Veuillez sélectionner un module";
    }
    
    if (!formData.nombreEtudiants || parseInt(formData.nombreEtudiants) <= 0) {
      errors.nombreEtudiants = "Le nombre d'étudiants doit être supérieur à 0";
    }

    if (selectedLocaux.length === 0) {
      errors.locaux = "Veuillez sélectionner au moins un local";
    }

    const totalCapacity = selectedLocaux.reduce((sum, localId) => {
      const local = locaux.find(l => l.id === localId);
      return sum + (local?.capacite || 0);
    }, 0);

    if (totalCapacity < parseInt(formData.nombreEtudiants)) {
      errors.capacity = "La capacité totale des locaux est insuffisante";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setValidationErrors({});

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const finalLocaux = localAssignmentMode === 'auto' 
        ? autoAssignLocaux(formData.nombreEtudiants)
        : selectedLocaux;

      const examData = {
        ...(examToEdit?.id && { id: examToEdit.id }),
        session: { id: parseInt(sessionId) },
        module: selectedModule?.nom || '', // Send module name, not ID
        nbEtudiants: parseInt(formData.nombreEtudiants),
        locaux: finalLocaux,
        date: date,
        horaire: timeSlot
      };

      if (examToEdit) {
        await updateExam(examData).unwrap();
      } else {
        await createExam(examData).unwrap();
      }
      
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      setError(error.message || "Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">
            {examToEdit ? 'Modifier l\'examen' : 'Programmer un examen'}
            <div className="text-sm font-normal text-gray-600">
              {date} - {timeSlot}
            </div>
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
            ×
          </button>
        </div>

        <div className="overflow-y-auto p-4">
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-medium">Option</label>
              <select 
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-black 
                  ${validationErrors.option ? 'border-red-500' : ''}`}
                value={formData.optionId}
                onChange={e => {
                  setFormData({
                    ...formData,
                    optionId: e.target.value,
                    moduleId: '',
                    nombreEtudiants: ''
                  });
                  setValidationErrors({});
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
              {validationErrors.option && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.option}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Module</label>
              <select 
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-black 
                  ${validationErrors.module ? 'border-red-500' : ''}`}
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
              {validationErrors.module && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.module}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Nombre d'étudiants</label>
              <input
                type="number"
                className={`w-full px-3 py-2 border rounded focus:ring-2 focus:ring-black 
                  ${validationErrors.nombreEtudiants ? 'border-red-500' : ''}`}
                value={formData.nombreEtudiants}
                onChange={e => {
                  setFormData({...formData, nombreEtudiants: e.target.value});
                  if (localAssignmentMode === 'auto') {
                    const autoLocaux = autoAssignLocaux(e.target.value);
                    setSelectedLocaux(autoLocaux);
                  }
                }}
                min="1"
                required
                disabled={!formData.moduleId}
              />
              {validationErrors.nombreEtudiants && (
                <p className="text-red-500 text-sm mt-1">{validationErrors.nombreEtudiants}</p>
              )}
              {selectedModule && (
                <p className="text-sm text-gray-600 mt-1">
                  Nombre d'étudiants de l'option: {selectedOption.nombreEtudiant}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">Attribution des locaux</label>
              <div className="space-y-4">
                <div className="flex space-x-4 border rounded p-2 bg-gray-50">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="localAssignment"
                      value="auto"
                      checked={localAssignmentMode === 'auto'}
                      onChange={e => {
                        setLocalAssignmentMode(e.target.value);
                        if (formData.nombreEtudiants) {
                          const autoLocaux = autoAssignLocaux(formData.nombreEtudiants);
                          setSelectedLocaux(autoLocaux);
                        }
                      }}
                      disabled={!formData.optionId}
                      className="mr-2"
                    />
                    <span className="text-sm">Automatique</span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="localAssignment"
                      value="manual"
                      checked={localAssignmentMode === 'manual'}
                      onChange={e => {
                        setLocalAssignmentMode(e.target.value);
                        setSelectedLocaux([]);
                      }}
                      disabled={!formData.optionId}
                      className="mr-2"
                    />
                    <span className="text-sm">Manuel</span>
                  </label>
                </div>

                {validationErrors.locaux && (
                  <p className="text-red-500 text-sm">{validationErrors.locaux}</p>
                )}

                {selectedLocaux.length > 0 && (
                  <div className="border rounded p-2 bg-blue-50">
                    <div className="font-medium mb-2 text-sm">Locaux sélectionnés:</div>
                    <div className="space-y-2">
                      {selectedLocaux.map(localId => {
                        const local = locaux.find(l => l.id === localId);
                        return (
                          <div key={localId} className="flex justify-between items-center text-sm">
                            <span>{local?.nom} ({local?.type})</span>
                            <span className="text-gray-600">Capacité: {local?.capacite}</span>
                          </div>
                        );
                      })}
                      <div className="border-t pt-2 mt-2">
                        <div className="flex justify-between text-sm font-medium">
                          <span>Capacité totale:</span>
                          <span>
                            {selectedLocaux.reduce((sum, localId) => {
                              const local = locaux.find(l => l.id === localId);
                              return sum + (local?.capacite || 0);
                            }, 0)} places
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {localAssignmentMode === 'manual' && (
                  <>
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
                      {filteredLocaux.length > 0 ? (
                        filteredLocaux.map(local => (
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
                            <label htmlFor={`local-${local.id}`} className="flex-1 cursor-pointer text-sm">
                              {local.nom} ({local.type}) - Capacité: {local.capacite}
                            </label>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-2 text-sm">
                          Aucun local disponible pour ce créneau
                        </p>
                      )}
                    </div>
                  </>
                )}

                {validationErrors.capacity && (
                  <p className="text-red-500 text-sm">{validationErrors.capacity}</p>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="border-t p-4 bg-gray-50">
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Annuler
            </button>
            <button 
              onClick={handleSubmit}
              className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 
                transition-colors duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  Traitement...
                </span>
              ) : (
                examToEdit ? 'Mettre à jour' : 'Programmer l\'examen'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};