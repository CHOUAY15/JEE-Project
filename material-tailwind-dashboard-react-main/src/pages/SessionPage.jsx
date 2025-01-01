import React, { useState } from 'react';
import { useGetSessionsQuery, useCreateSessionMutation, useDeleteSessionMutation, useUpdateSessionMutation } from '../features/session/sessionApi';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from 'react-router-dom';
import DashboardNavbar from '@/widgets/layout/dashboard-navbar';
import { useDispatch } from 'react-redux';
import { setSelectedSession } from '../features/exam/examSlice';

const SessionPage = () => {
  const navigate = useNavigate();
  const { data: sessions = [], isLoading, isError } = useGetSessionsQuery();
  const [addSession] = useCreateSessionMutation();
  const [updateSession] = useUpdateSessionMutation();
  const [deleteSession] = useDeleteSessionMutation();

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [newSession, setNewSession] = useState({
    id: null,
    typeSession: '',
    dateDebut: null,
    dateFin: null,
    start1: '08:00',
    end1: '10:00',
    start2: '10:30',
    end2: '12:30',
    start3: '14:00',
    end3: '16:00',
    start4: '16:30',
    end4: '18:30',
  });

  const dispatch = useDispatch();

  const handleSessionClick = (session) => {
    dispatch(setSelectedSession({ 
      sessionId: session.id,
      sessionType: session.typeSession,
      sessionDates: {
        start: session.dateDebut,
        end: session.dateFin
      },
      timeSlots: {
        slot1: { start: session.start1, end: session.end1 },
        slot2: { start: session.start2, end: session.end2 },
        slot3: { start: session.start3, end: session.end3 },
        slot4: { start: session.start4, end: session.end4 }
      }
    }));
    navigate(`/dashboard/home`);
  };

  const handleEditClick = (e, session) => {
    e.stopPropagation();
    setIsEditing(true);
    setSelectedSessionId(session.id);
    setNewSession({
      ...session,
      dateDebut: new Date(session.dateDebut),
      dateFin: new Date(session.dateFin),
    });
    setShowModal(true);
  };

  const handleAddOrUpdateSession = async () => {
    if (newSession.typeSession && newSession.dateDebut && newSession.dateFin) {
      try {
        if (isEditing) {
          await updateSession({ id: selectedSessionId, ...newSession }).unwrap();
        } else {
          await addSession(newSession).unwrap();
        }
        setShowModal(false);
        resetForm();
      } catch (error) {
        console.error("Failed to save session:", error);
      }
    }
  };

  const handleDeleteClick = (e, session) => {
    e.stopPropagation();
    setSessionToDelete(session);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!sessionToDelete) {
      console.error("No session selected for deletion");
      return;
    }
    
    try {
      const result = await deleteSession(sessionToDelete.id).unwrap();
      console.log("Delete result:", result); // Pour le débogage
      setShowDeleteModal(false);
      setSessionToDelete(null);
    } catch (error) {
      console.error("Failed to delete session:", error);
      // Optionnellement, ajoutez une notification d'erreur ici
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setSelectedSessionId(null);
    setNewSession({
      id: null,
      typeSession: '',
      dateDebut: null,
      dateFin: null,
      start1: '08:00',
      end1: '10:00',
      start2: '10:30',
      end2: '12:30',
      start3: '14:00',
      end3: '16:00',
      start4: '16:30',
      end4: '18:30',
    });
  };

  return (
    <div>
      <DashboardNavbar />
      <div className="p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">Sessions</h1>
            <p className="text-gray-600">Gérer les sessions d'examen</p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
          >
            + Nouvelle session
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          </div>
        ) : isError ? (
          <div className="text-red-500 p-4 bg-red-50 rounded">
            Une erreur est survenue lors du chargement des sessions.
          </div>
        ) : (
          <div className="mt-4 overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-4 border-b">Type</th>
                  <th className="text-left p-4 border-b">Date de Début</th>
                  <th className="text-left p-4 border-b">Date de Fin</th>
                  <th className="text-left p-4 border-b">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    onClick={() => handleSessionClick(session)}
                    className="cursor-pointer hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="p-4 border-b">{session.typeSession}</td>
                    <td className="p-4 border-b">{new Date(session.dateDebut).toLocaleDateString()}</td>
                    <td className="p-4 border-b">{new Date(session.dateFin).toLocaleDateString()}</td>
                    <td className="p-4 border-b">
                      <button
                        onClick={(e) => handleEditClick(e, session)}
                        className="text-black hover:text-gray-600 mr-4"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(e, session)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 w-[400px]">
              <h3 className="text-lg font-bold mb-4">Confirmer la suppression</h3>
              <p className="mb-6">Êtes-vous sûr de vouloir supprimer cette session ? Cette action ne peut pas être annulée.</p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                >
                  Annuler
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add/Edit Session Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded p-6 w-[400px] max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">
                  {isEditing ? 'Modifier la session' : 'Ajouter une session'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Type de Session</label>
                <select
                  className="w-full p-2 border rounded focus:border-black focus:ring-1 focus:ring-black"
                  value={newSession.typeSession}
                  onChange={(e) => setNewSession({ ...newSession, typeSession: e.target.value })}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Normale d'hiver">Normale d'hiver</option>
                  <option value="Normale de printemps">Normale de printemps</option>
                  <option value="Rattrapage d'hiver">Rattrapage d'hiver</option>
                  <option value="Rattrapage de printemps">Rattrapage de printemps</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block mb-2">Date Range</label>
                <DatePicker
                  selected={newSession.dateDebut}
                  onChange={(dates) => {
                    const [start, end] = dates;
                    setNewSession({ ...newSession, dateDebut: start, dateFin: end });
                  }}
                  selectsRange
                  startDate={newSession.dateDebut}
                  endDate={newSession.dateFin}
                  isClearable
                  placeholderText="Select Date Range"
                  className="w-full p-2 border rounded focus:border-black focus:ring-1 focus:ring-black"
                />
              </div>

              <div className="mb-4">
                <label className="block mb-2">Heures</label>
                <div className="grid grid-cols-2 gap-2">
                  {[1, 2, 3, 4].map((slot) => (
                    <React.Fragment key={slot}>
                      <input
                        type="time"
                        className="w-full p-2 border rounded focus:border-black focus:ring-1 focus:ring-black"
                        value={newSession[`start${slot}`]}
                        onChange={(e) => setNewSession({ ...newSession, [`start${slot}`]: e.target.value })}
                      />
                      <input
                        type="time"
                        className="w-full p-2 border rounded focus:border-black focus:ring-1 focus:ring-black"
                        value={newSession[`end${slot}`]}
                        onChange={(e) => setNewSession({ ...newSession, [`end${slot}`]: e.target.value })}
                      />
                    </React.Fragment>
                  ))}
                </div>
              </div>

              <button
                onClick={handleAddOrUpdateSession}
                className="w-full bg-black text-white p-2 rounded hover:bg-gray-800 transition-colors duration-200"
              >
                {isEditing ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionPage;