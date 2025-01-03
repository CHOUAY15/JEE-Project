import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetDepartmentTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation
} from '../features/teacher/teacherSlice';
import { useSelector , useDispatch} from 'react-redux';

import { useGetDepartmentsQuery } from '../features/department/departmentSlice';
import { ArrowLeft } from "lucide-react";
import { TeacherCalendar } from './TeacherCalendar';

const TeachersPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { data: departments = [] } = useGetDepartmentsQuery();
 // Supposons que vous ayez un endpoint pour récupérer les données de session
  const selectedSession = useSelector((state) => state.exams.selectedSession);
  // État pour gérer l'affichage du calendrier
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  // Convertir l'ID en nombre pour la comparaison
  const department = departments.find(d => d.id === Number(departmentId));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: teachers = [], isLoading } = useGetDepartmentTeachersQuery(departmentId);
  const [createTeacher] = useCreateTeacherMutation();
  const [updateTeacher] = useUpdateTeacherMutation();
  const [deleteTeacher] = useDeleteTeacherMutation();

  const [editingTeacher, setEditingTeacher] = useState(null);
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    estDispense: false,
    nbSurveillances: 0
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
      
    try {
      const teacherData = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        estDispense: formData.estDispense,
        nbSurveillances: 0
      };

      if (editingTeacher) {
        await updateTeacher({ 
          id: editingTeacher.id,
          ...teacherData
        }).unwrap();
      } else {
        await createTeacher({
          departmentId: Number(departmentId),
          teacher: teacherData
        }).unwrap();
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save teacher:', error);
    }
  };

  // Si le département n'est pas trouvé, afficher un message d'erreur
  if (!department) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate('/dashboard/departements')}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Retour aux départements</span>
        </button>
        <div className="mt-4 text-red-600">
          Département non trouvé
        </div>
      </div>
    );
  }

  const handleDeleteClick = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet enseignant ?')) {
      try {
        await deleteTeacher(id).unwrap();
      } catch (error) {
        console.error('Failed to delete teacher:', error);
      }
    }
  };

  const handleEditClick = (teacher) => {
    setEditingTeacher(teacher);
    setFormData({
      nom: teacher.nom,
      prenom: teacher.prenom,
      email: teacher.email,
      estDispense: teacher.estDispense,
      nbSurveillances: teacher.nbSurveillances
    });
    setIsModalOpen(true);
  };

  const handleTeacherClick = (teacher) => {
    setSelectedTeacher(teacher);
    setShowCalendar(true);
  };

  const resetForm = () => {
    setEditingTeacher(null);
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      estDispense: false,
      nbSurveillances: 0
    });
  };

  if (isLoading) {
    return <div>Chargement...</div>;
  }

  if (showCalendar && selectedTeacher) {
    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center space-x-4 mb-6">
          <button
            onClick={() => setShowCalendar(false)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">
            Occupations de {selectedTeacher.prenom} {selectedTeacher.nom}
          </h1>
        </div>
        
        {selectedSession && (
          <TeacherCalendar 
            sessionData={selectedSession} 
            teacherId={selectedTeacher.id} 
          />
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/dashboard/departements')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold">
            Département {department?.nom} - Gérer les enseignants
          </h1>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          className="bg-black text-white py-2 px-4 rounded hover:bg-gray-800"
        >
          + Ajouter un nouvel enseignant
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2 text-left">Nom</th>
              <th className="p-2 text-left">Prénom</th>
              <th className="p-2 text-left">Email</th>
              <th className="p-2 text-left">Dispensé</th>
              <th className="p-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr 
                key={teacher.id} 
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handleTeacherClick(teacher)}
              >
                <td className="p-2">{teacher.nom}</td>
                <td className="p-2">{teacher.prenom}</td>
                <td className="p-2">{teacher.email}</td>
                <td className="p-2">{teacher.estDispense ? '✓' : '✗'}</td>
                <td className="p-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditClick(teacher);
                    }}
                    className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 mr-2"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteClick(teacher.id);
                    }}
                    className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
                <h2 className="text-xl font-bold mb-4">
                  {editingTeacher ? 'Modifier l\'enseignant' : 'Ajouter un enseignant'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block mb-1">Nom</label>
                    <input
                      type="text"
                      value={formData.nom}
                      onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Prénom</label>
                    <input
                      type="text"
                      value={formData.prenom}
                      onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.estDispense}
                        onChange={(e) => setFormData({ ...formData, estDispense: e.target.checked })}
                        className="mr-2"
                      />
                      Dispensé
                    </label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsModalOpen(false);
                        resetForm();
                      }}
                      className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    >
                      {editingTeacher ? 'Mettre à jour' : 'Ajouter'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;