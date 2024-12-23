import React, { useState } from 'react';
import { useGetExamsQuery, useDeleteExamMutation, useGetLocauxQuery } from '../../features/exam/examSlice';
import { ExamScheduler } from './ExamScheduler';

export const ExamCell = ({ date, timeSlot, sessionId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [deleteExam] = useDeleteExamMutation();
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [examToDelete, setExamToDelete] = useState(null);
  const [isNewExam, setIsNewExam] = useState(false);

  // Récupérer les examens
  const { 
    data: exams = [], 
    isLoading: isLoadingExams, 
    error: examsError, 
    refetch 
  } = useGetExamsQuery(
    { sessionId, date, horaire: timeSlot },
    { 
      skip: !sessionId,
      refetchOnMountOrArgChange: true 
    }
  );

  // Récupérer la liste des locaux pour faire la correspondance
  const { data: locaux = [] } = useGetLocauxQuery();

  // Fonction pour obtenir les noms des locaux à partir des IDs
  const getLocauxNames = (localIds) => {
    if (!Array.isArray(localIds) || !Array.isArray(locaux)) return 'Non assigné';
    
    return localIds
      .map(id => {
        const local = locaux.find(l => l.id === id);
        return local ? local.nom : `Local ${id}`;
      })
      .join(', ');
  };

  const handleEdit = (exam) => {
    setSelectedExam(exam);
    setIsDialogOpen(false);
    setIsSchedulerOpen(true);
  };

  const handleAddExam = () => {
    setIsDialogOpen(false);
    setSelectedExam(null);
    setIsNewExam(true);
    setIsSchedulerOpen(true);
  };
  const handleDelete = async (examId) => {
    try {
      setIsDialogOpen(false); // Close the exam details dialog if open
      setIsDeleteDialogOpen(true); // Open delete confirmation dialog
      setExamToDelete(examId);
    } catch (error) {
      console.error('Failed to prepare delete:', error);
    }
  };

  return (
    <div className="relative h-full">
      <div 
        onClick={() => setIsDialogOpen(true)}
        className={`h-full w-full min-h-[60px] cursor-pointer hover:bg-gray-50 p-2 
          ${exams?.length > 0 ? 'bg-blue-50' : ''}`}
      >
        {isLoadingExams ? (
          <div className="text-sm text-gray-500">Chargement...</div>
        ) : examsError ? (
          <div className="text-sm text-red-500">Erreur de chargement</div>
        ) : (
          <div className="text-sm text-gray-600">
            {exams?.length > 0 ? `${exams.length} examen(s)` : 'Aucun examen'}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Examens du {new Date(date).toLocaleDateString('fr-FR')} - {timeSlot}
              </h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {exams?.length > 0 ? (
              <div className="space-y-4">
                {exams.map(exam => (
                  <div key={exam.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="font-medium text-lg">
                          {exam.module}
                        </div>
                        <div className="text-sm text-gray-600">
                          {exam.session && (
                            <div>
                              Session: {exam.session.typeSession}
                            </div>
                          )}
                          <div>
                            Locaux: {getLocauxNames(exam.locaux)}
                          </div>

                          <div>
                            Nombre d'étudiants: {exam.nbEtudiants}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEdit(exam)}
                          className="text-blue-600 hover:text-blue-800 text-sm px-3 py-1 rounded
                            hover:bg-blue-50 transition-colors duration-200"
                        >
                          Modifier
                        </button>
                        <button 
                          onClick={() => handleDelete(exam.id)}
                          className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded
                            hover:bg-red-50 transition-colors duration-200"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mb-4">
                Aucun examen programmé pour ce créneau
              </p>
            )}

            <div className="mt-4 flex justify-end">
              <button
                onClick={handleAddExam}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 
                  transition-colors duration-200"
              >
                + Ajouter un examen
              </button>
            </div>
          </div>
        </div>
      )}
{isDeleteDialogOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
    <div className="bg-white rounded-lg p-6 w-full max-w-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Confirmer la suppression</h2>
        <button 
          onClick={() => setIsDeleteDialogOpen(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>

      <p className="text-gray-600 mb-6">
        Êtes-vous sûr de vouloir supprimer cet examen ? Cette action est irréversible.
      </p>

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsDeleteDialogOpen(false)}
          className="px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          Annuler
        </button>
        <button
          onClick={async () => {
            try {
              await deleteExam(examToDelete).unwrap();
              await refetch();
              setIsDeleteDialogOpen(false);
            } catch (error) {
              console.error('Failed to delete exam:', error);
            }
          }}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Supprimer
        </button>
      </div>
    </div>
  </div>
)}
      <ExamScheduler
        isOpen={isSchedulerOpen}
        onClose={() => {
          setIsSchedulerOpen(false);
          setSelectedExam(null);
          setIsNewExam(false);
          refetch();
        }}
        date={date}
        timeSlot={timeSlot}
        sessionId={sessionId}
        examToEdit={selectedExam}
      />
    </div>
  );
};