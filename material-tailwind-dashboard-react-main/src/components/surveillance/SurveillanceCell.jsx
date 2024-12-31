import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGetLocauxQuery } from '../../features/local/localSlice';
import { 
  useAssignSurveillantMutation,
  useDeleteSurveillantMutation,
  useGetExamensQuery,
  useGetExamensResQuery
} from '../../features/surveillance/surveillanceAPI';
import { setSurveillance } from '../../features/surveillance/surveillanceSlice';
import { useGetOptionsQuery } from '@/features/exam/examSlice';

export const SurveillanceCell = ({ teacher, date, timeSlot }) => {
  const dispatch = useDispatch();
  const selectedSession = useSelector(state => state.exams.selectedSession);
  const surveillances = useSelector(state => state.surveillance.surveillances);
  const { data: locaux = [] } = useGetLocauxQuery();
  const [selectedOption, setSelectedOption] = useState('');
  const { data: options = [] } = useGetOptionsQuery();

  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showExamDialog, setShowExamDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedType, setSelectedType] = useState('');

  const showError = (message) => {
    setErrorMessage(message);
    setShowErrorDialog(true);
  };

  const handleCloseErrorDialog = (e) => {
    e.stopPropagation();

    setShowErrorDialog(false);
    setErrorMessage('');
  };

  

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isClickInsideMenu = event.target.closest('.menu-container');
      const isClickInsideCell = event.target.closest('.cell-container');
      
      if (!isClickInsideMenu && !isClickInsideCell) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const surveillance = useSelector(state => {
    const key = `${teacher.id}-${date}-${timeSlot}`;
    return state.surveillance.surveillances[key];
  });

  const [assignSurveillant] = useAssignSurveillantMutation();
  const [deleteSurveillant] = useDeleteSurveillantMutation();

  const { data: examens = [], isLoading: isLoadingExams } = useGetExamensQuery({
    sessionId: selectedSession?.sessionId,
    date,
    horaire: timeSlot
  }, {
    skip: !selectedSession?.sessionId
  });
  
  const { data: examensForfilter = [], isLoading: isLoadingExamsForfilter } = useGetExamensResQuery({
    sessionId: selectedSession?.sessionId,
    date,
    horaire: timeSlot
  }, {
    skip: !selectedSession?.sessionId
  });
  
  
  const surveillancess = Object.values(useSelector(state => state.surveillance.surveillances));

  const checkConstraints = (type, teacherId, date) => {
    
    // Vérifier le maximum de séances par jour
    const teacherDailySurveillances = surveillancess.filter(s => 
      s.teacherId === teacherId && s.date === date
    );

    if (teacherDailySurveillances.length >= 2) {
      showError("L'enseignant a déjà atteint le maximum de 2 séances pour ce jour");
      return false;
    }

    // Pour les RR, vérifier le nombre max par période et la répartition
    if (type === 'RR') {
      const periodRR = surveillancess.filter(s => 
        s.date === date && s.horaire === timeSlot && s.typeSurveillant === 'RR'
      );

      if (periodRR.length >= 10) {
        showError("Le nombre maximum de réservistes (10) est atteint pour cette période");
        return false;
      }

      // Vérifier la répartition équitable
      const teacherRRCount = surveillancess.filter(s => 
        s.teacherId === teacherId && s.typeSurveillant === 'RR'
      ).length;

      const minOtherTeacherRR = Math.min(...Object.values(
        surveillancess.filter(s => s.typeSurveillant === 'RR' && s.teacherId !== teacherId)
          .reduce((acc, s) => {
            acc[s.teacherId] = (acc[s.teacherId] || 0) + 1;
            return acc;
          }, {})
      ) || 0);

      if (teacherRRCount > minOtherTeacherRR) {
        alert("D'autres enseignants doivent être réservistes avant");
        return false;
      }
    }

    return true;
  };

  useEffect(() => {
    if (examens.length > 0) {
      console.log('Examens disponibles:', examens);
      console.log('Option sélectionnée:', selectedOption);
    }
  }, [examens, selectedOption]);
  const handleCellClick = async (e) => {
    e.stopPropagation();

  
    if (!surveillance && (!examens || examens.length === 0)) {
      setErrorMessage("Aucun examen n'est prévu pour cette période");
      setShowErrorDialog(true);
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: rect.left,
      y: rect.bottom + window.scrollY
    });
    setShowMenu(true);
  };

  // Le style de la cellule dépend maintenant directement des examens
  const cellStyle = `border px-4 py-2 text-center cell-container ${
    surveillance || (examens && examens.length > 0)
      ? 'cursor-pointer hover:bg-gray-100'
      : 'bg-gray-50'
  }`;


  const handleDelete = async () => {
    try {
      if (surveillance?.id) {
        await deleteSurveillant(surveillance.id).unwrap();
        dispatch(setSurveillance({
          teacherId: teacher.id,
          date,
          timeSlot,
          status: ''
        }));
      }
      setShowDeleteDialog(false);
    } catch (error) {
      console.error('Delete error:', error);
      alert('Erreur lors de la suppression');
    }
  };
 

  
  const handleStatusSelect = async (status, e) => {
    e.stopPropagation();

    // Toujours montrer le dialogue de sélection d'examen directement
    if (status === 'EXAM') {
      setSelectedType('PRINCIPAL'); // Changé de 'EXAM' à 'PRINCIPAL'
      setShowExamDialog(true);
      setShowMenu(false);
      return;
    }
  
    if (status === 'TT') {
      setSelectedType('TT');
      setShowExamDialog(true);
      setShowMenu(false);
      return;
    }

    // Le reste pour TT et RR reste identique
    if (surveillance && status !== '') {
      setPendingAction({ type: status });
      setShowConfirmDialog(true);
      setShowMenu(false);
      return;
    }

    try {
      if (!checkConstraints(status, teacher.id, date)) {
        return;
      }

      if (status === 'TT' || status === 'RR') {
        const result = await assignSurveillant({
          enseignantId: teacher.id,
          date,
          horaire: timeSlot,
          sessionId: selectedSession.sessionId,
          typeSurveillant: status
        }).unwrap();

        if (result) {
          dispatch(setSurveillance({
            teacherId: teacher.id,
            date,
            timeSlot,
            status,
            id: result.id,
            typeSurveillant: status
          }));
        }
      } else if (status === '') {
        setShowDeleteDialog(true);
      }
      setShowMenu(false);
    } catch (error) {
      console.error('Failed to handle status:', error);
      setErrorMessage('Une erreur est survenue lors de l\'assignation');
      setShowErrorDialog(true);
    }
};

const handleExamSelect = async (exam, localId = null) => {
  if (!checkConstraints(selectedType, teacher.id, date)) {
    return;
  }

  // Si on a déjà une surveillance, montrer le dialogue de confirmation
  if (surveillance) {
    setPendingAction({ 
      type: selectedType,
      exam: exam,
      localId: localId // null pour TT
    });
    setShowConfirmDialog(true);
    setShowExamDialog(false);
    return;
  }

  try {
    const assignmentData = {
      enseignantId: teacher.id,
      date,
      horaire: timeSlot,
      sessionId: selectedSession.sessionId,
      typeSurveillant: selectedType,
      examenId: exam.id
    };

    // Ajouter le localId seulement pour les surveillances normales
    if (selectedType === 'PRINCIPAL') {
      assignmentData.localId = localId;
    }

    const result = await assignSurveillant(assignmentData).unwrap();

    if (result) {
      dispatch(setSurveillance({
        teacherId: teacher.id,
        date,
        timeSlot,
        status: selectedType === 'TT' ? 'TT' : locaux.find(l => l.id === localId)?.nom || `Local ${localId}`,
        id: result.id,
        examenId: exam.id,
        localId: selectedType === 'TT' ? null : localId,
        typeSurveillant: selectedType
      }));
    }

    setShowExamDialog(false);
  } catch (error) {
    console.error('Failed to assign surveillant:', error);
    setErrorMessage('Une erreur est survenue lors de l\'assignation');
    setShowErrorDialog(true);
  }
};

const handleConfirmAction = async () => {
  try {
    if (!pendingAction) return;

    // Supprimer d'abord l'ancienne assignation
    if (surveillance?.id) {
      await deleteSurveillant(surveillance.id).unwrap();
    }

    let assignmentData = {
      enseignantId: teacher.id,
      date,
      horaire: timeSlot,
      sessionId: selectedSession.sessionId,
      typeSurveillant: pendingAction.type
    };

    // Ajouter examenId et localId seulement si c'est une surveillance d'examen
    if (pendingAction.exam) {
      assignmentData.examenId = pendingAction.exam.id;
      if (pendingAction.type === 'PRINCIPAL') {
        assignmentData.localId = pendingAction.localId;
      }
    }

    console.log('Données d\'assignation:', assignmentData);

    const result = await assignSurveillant(assignmentData).unwrap();

    // Mise à jour du state avec les bonnes données selon le type
    const newSurveillanceData = {
      teacherId: teacher.id,
      date,
      timeSlot,
      status: pendingAction.type,
      id: result.id,
      typeSurveillant: pendingAction.type
    };

    // Ajouter les données spécifiques à l'examen si nécessaire
    if (pendingAction.exam) {
      newSurveillanceData.examenId = pendingAction.exam.id;
      if (pendingAction.type === 'PRINCIPAL') {
        newSurveillanceData.localId = pendingAction.localId;
        newSurveillanceData.status = locaux.find(l => l.id === pendingAction.localId)?.nom || `Local ${pendingAction.localId}`;
      }
    }

    dispatch(setSurveillance(newSurveillanceData));

    setShowConfirmDialog(false);
    setPendingAction(null);
  } catch (error) {
    console.error('Failed to modify surveillance:', error);
    console.error('Error details:', error.data || error);
    setErrorMessage(error.data?.message || 'Une erreur est survenue lors de la modification');
    setShowErrorDialog(true);
  }
};

  return (
   // Dans le return du composant
   <td
   className={cellStyle}
   onClick={handleCellClick}
 >
   {surveillance ? (
     surveillance.typeSurveillant === 'TT' || surveillance.typeSurveillant === 'RR'
       ? surveillance.typeSurveillant
       : locaux.find(l => l.id === surveillance.localId)?.nom || '-'
   ) : examens && examens.length > 0 ? '-' : ''}
      {showMenu && (
        <div
          className="fixed bg-white shadow-lg rounded-lg z-50 border menu-container"
          style={{
            top: `${menuPosition?.y || 0}px`,
            left: `${menuPosition?.x || 0}px`,
          }}
        >
          <div className="p-2">
            <button
              onClick={(e) => handleStatusSelect('TT', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              TT
            </button>
            <button
              onClick={(e) => handleStatusSelect('RR', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              RR
            </button>
            <button
              onClick={(e) => handleStatusSelect('EXAM', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Choisir examen
            </button>
            <button
              onClick={(e) => handleStatusSelect('', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded text-red-600"
            >
              Effacer
            </button>
          </div>
        </div>
      )}
{showErrorDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 max-w-sm w-full">
      <div className="mb-4 flex items-center">
        <div className="rounded-full bg-red-100 p-2 mr-3">
          <svg className="w-6 h-6 text-red-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
        </div>
        <h2 className="text-lg font-semibold">Attention</h2>
      </div>
      <p className="text-gray-600 mb-6">{errorMessage}</p>
      <div className="flex justify-end">
        <button
  onClick={(e) => handleCloseErrorDialog(e)}
  className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-700"
        >
          Fermer
        </button>
      </div>
    </div>
  </div>
)}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmer le changement</h2>
            <p className="text-gray-600 mb-6">
              Cette action va remplacer l'assignation existante. Voulez-vous continuer ?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowConfirmDialog(false);
                  setPendingAction(null);
                }}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleConfirmAction}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir effacer cette assignation ?
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

{showExamDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">
          {selectedType === 'TT' ? 'Sélectionner l\'examen à surveiller (TT)' : 'Sélectionner un examen et un local'}
        </h2>
        <button
          onClick={() => setShowExamDialog(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      {/* Filtre par option */}
      <div className="mb-4">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    Filtrer par option
  </label>
  <select
    value={selectedOption}
    onChange={(e) => {
      console.log('Nouvelle option sélectionnée:', e.target.value);
      setSelectedOption(e.target.value);
    }}
    className="w-full p-2 border rounded"
  >
    <option value="">Toutes les options</option>
    {options.map(option => (
      <option key={option.id} value={option.id}>
        {option.nomOption}
      </option>
    ))}
  </select>
</div>

      <div className="space-y-4">
        {isLoadingExams ? (
          <div className="text-center py-4">Chargement des examens...</div>
        ) : examensForfilter.length === 0 ? (
          <div className="text-center py-4 text-gray-500">Aucun examen disponible</div>
        ) : (
          <div className="space-y-4">
            {examensForfilter
  .filter(exam => {
    if (!selectedOption) return true;
    return exam.optionId?.toString() === selectedOption.toString();
  })
  .map(exam => (
    <div key={exam.id} className="border rounded p-4">
      <div className="font-medium">{exam.module}</div>
      <div className="text-sm text-gray-500">Option: {exam.optionName}</div>
                  {/* Pour TT, pas besoin de sélectionner un local */}
                  {selectedType === 'TT' ? (
                    <button
                      onClick={() => handleExamSelect(exam)}
                      className="mt-2 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Sélectionner cet examen
                    </button>
                  ) : (
                    <div className={`mt-2 grid ${
                      exam.locaux?.length <= 2 ? 'grid-cols-1' : 
                      exam.locaux?.length <= 4 ? 'grid-cols-2' : 
                      'grid-cols-3'
                    } gap-2`}>                      {exam.locaux?.map(localId => {
                        const local = locaux.find(l => l.id === localId);
                        return (
                          <button
                            key={localId}
                            onClick={() => handleExamSelect(exam, localId)}
                            className="px-3 py-2 text-sm border rounded hover:bg-gray-50"
                          >
                            {local?.nom || `Local ${localId}`}
                            {local && ` (${local.capacite} places)`}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setShowExamDialog(false)}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Annuler
        </button>
      </div>
    </div>
  </div>
)}
    </td>
  );
};