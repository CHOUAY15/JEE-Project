import React, { useState, useMemo } from 'react';
import { useGetTeacherDispensesQuery, useCreateTeacherDispenseMutation, useDeleteTeacherDispenseMutation } from '../features/teacher/teacherSlice';

export const TeacherScheduleCell = ({ date, timeSlot, teacherId }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState(null);

  // Parse timeSlot to get start and end times
  const [startTime, endTime] = timeSlot.split('-');
  
  const { 
    data: allSchedules = [], 
    isLoading: isLoadingSchedules, 
    error: schedulesError, 
    refetch 
  } = useGetTeacherDispensesQuery(teacherId, { 
    skip: !teacherId,
    refetchOnMountOrArgChange: true 
  });

  // Filtrer les dispenses pour cette date et ce créneau horaire
  const cellSchedules = useMemo(() => {
    return allSchedules.filter(schedule => {
      // D'abord, vérifions si c'est la même date
      const scheduleDate = schedule.dateDebut.split(' ')[0];
      if (scheduleDate !== date) return false;

      // Extraire l'heure de la dispense (format "HH:mm:ss")
      const [scheduleTime] = schedule.dateDebut.split(' ')[1].split(':');
      
      // Extraire les heures de début et fin du créneau (format "HH:mm")
      const [slotStartHour] = startTime.split(':');
      const [slotEndHour] = endTime.split(':');
      
      // Convertir en nombres pour la comparaison
      const scheduleHour = parseInt(scheduleTime);
      const startHour = parseInt(slotStartHour);
      const endHour = parseInt(slotEndHour);

      console.log('Comparaison des heures:', {
        scheduleHour,
        startHour,
        endHour,
        timeSlot,
        scheduleTime: schedule.dateDebut
      });

      // Vérifier si l'heure de la dispense correspond au créneau
      return scheduleHour >= startHour && scheduleHour < endHour;
    });
  }, [allSchedules, date, timeSlot, startTime, endTime]);

  const [deleteSchedule] = useDeleteTeacherDispenseMutation();
  const [createSchedule] = useCreateTeacherDispenseMutation();

  const [newSchedule, setNewSchedule] = useState({
    cause: '',
  });

  const handleDelete = (scheduleId) => {
    setIsDeleteDialogOpen(true);
    setScheduleToDelete(scheduleId);
    setIsDialogOpen(false);
  };

  const formatTimeForDatabase = (time) => {
    const [hours, minutes = "00"] = time.split(':');
    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
  };

  const handleAddSchedule = async () => {
    if (!teacherId) {
      console.error('teacherId est manquant');
      return;
    }

    // Créer les dates au format "YYYY-MM-DD HH:mm:ss"
    const startDateTime = `${date} ${formatTimeForDatabase(startTime)}`;
    const endDateTime = `${date} ${formatTimeForDatabase(endTime)}`;

    const dispenseData = {
      cause: newSchedule.cause,
      dateDebut: startDateTime,
      dateFin: endDateTime,
      enseignant: {
        id: parseInt(teacherId)
      }
    };

    console.log('Données à envoyer:', dispenseData);

    try {
      const response = await createSchedule({ 
        teacherId: teacherId,
        dispenseData: dispenseData
      }).unwrap();
      console.log('Réponse de création:', response);
      await refetch();
      setIsAddDialogOpen(false);
      setNewSchedule({ cause: '' });
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la dispense:', {
        error,
        status: error.status,
        data: error.data,
        dispenseData
      });
    }
  };

  return (
    <div className="relative h-full">
      <div 
        onClick={() => cellSchedules.length > 0 ? setIsDialogOpen(true) : setIsAddDialogOpen(true)}
        className={`h-full w-full min-h-[60px] cursor-pointer hover:bg-gray-50 p-2 
          ${cellSchedules.length > 0 ? 'bg-yellow-50' : ''}`}
      >
        {isLoadingSchedules ? (
          <div className="text-sm text-gray-500">Chargement...</div>
        ) : schedulesError ? (
          <div className="text-sm text-red-500">Erreur: {schedulesError.toString()}</div>
        ) : (
          <div className="text-sm text-gray-600">
            {cellSchedules.length > 0 ? (
              <div>
                {`${cellSchedules.length} dispense${cellSchedules.length > 1 ? 's' : ''}`}
                <div className="text-xs text-gray-500">{timeSlot}</div>
              </div>
            ) : ''}
          </div>
        )}
      </div>

      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">
                Dispenses du {new Date(date).toLocaleDateString('fr-FR')}
              </h2>
              <button 
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {cellSchedules.map(schedule => (
                <div key={schedule.id} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="font-medium text-lg">
                        Cause: {schedule.cause}
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Date: {schedule.dateDebut.split(' ')[0]}</div>
                        <div>De: {schedule.dateDebut.split(' ')[1]}</div>
                        <div>À: {schedule.dateFin.split(' ')[1]}</div>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDelete(schedule.id)}
                      className="text-red-600 hover:text-red-800 text-sm px-3 py-1 rounded hover:bg-red-50"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => {
                  setIsDialogOpen(false);
                  setIsAddDialogOpen(true);
                }}
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                + Ajouter une dispense
              </button>
            </div>
          </div>
        </div>
      )}

      {isAddDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999]">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Ajouter une dispense</h2>
              <button 
                onClick={() => setIsAddDialogOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Cause</label>
                <input
                  type="text"
                  className="mt-2 w-full px-4 py-2 border rounded-lg"
                  value={newSchedule.cause}
                  onChange={(e) => setNewSchedule({ ...newSchedule, cause: e.target.value })}
                  placeholder="Entrez la cause de la dispense"
                />
              </div>

              <div>
                <label className="block text-gray-700">Période</label>
                <div className="text-sm text-gray-600 mt-1">
                  <div>Date: {date}</div>
                  <div>De: {startTime}</div>
                  <div>À: {endTime}</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setIsAddDialogOpen(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Annuler
              </button>
              <button
                onClick={handleAddSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Ajouter
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
              Êtes-vous sûr de vouloir supprimer cette dispense ? Cette action est irréversible.
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
                    await deleteSchedule({ 
                      teacherId, 
                      dispenseId: scheduleToDelete 
                    }).unwrap();
                    await refetch();
                    setIsDeleteDialogOpen(false);
                  } catch (error) {
                    console.error('Failed to delete dispense:', error);
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
    </div>
  );
};