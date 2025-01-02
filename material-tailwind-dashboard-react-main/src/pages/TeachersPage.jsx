import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  useGetDepartmentTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation
} from '../features/teacher/teacherSlice';
import { useGetDepartmentsQuery } from '../features/department/departmentSlice';
import { ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
} from "@material-tailwind/react";

const TeachersPage = () => {
  const { departmentId } = useParams();
  const navigate = useNavigate();
  const { data: departments = [] } = useGetDepartmentsQuery();

  const department = departments.find(d => d.id === Number(departmentId));
  console.log({
    departmentId,
    departments,
    foundDepartment: department
  }); 

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);
  
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

  const handleDeleteClick = (teacher) => {
    setTeacherToDelete(teacher);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (teacherToDelete) {
      try {
        await deleteTeacher(teacherToDelete.id).unwrap();
        setDeleteDialogOpen(false);
        setTeacherToDelete(null);
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
            <tr key={teacher.id} className="border-b hover:bg-gray-100">
              <td className="p-2">{teacher.nom}</td>
              <td className="p-2">{teacher.prenom}</td>
              <td className="p-2">{teacher.email}</td>
              <td className="p-2">{teacher.estDispense ? '✓' : '✗'}</td>
              <td className="p-2">
                <button
                  onClick={() => handleEditClick(teacher)}
                  className="bg-blue-500 text-white py-1 px-2 rounded hover:bg-blue-700 mr-2"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteClick(teacher)}
                  className="bg-red-500 text-white py-1 px-2 rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Dialog de confirmation de suppression */}
      <Dialog
        open={deleteDialogOpen}
        handler={() => setDeleteDialogOpen(false)}
        size="sm"
      >
        <DialogHeader className="justify-between">
          <h4 className="text-xl font-bold">Confirmer la suppression</h4>
        </DialogHeader>
        <DialogBody divider className="text-center py-8">
          Êtes-vous sûr de vouloir supprimer l'enseignant{' '}
          <span className="font-bold">
            {teacherToDelete?.prenom} {teacherToDelete?.nom}
          </span>
          ?
        </DialogBody>
        <DialogFooter className="space-x-2">
          <Button
            variant="text"
            color="gray"
            onClick={() => setDeleteDialogOpen(false)}
            className="mr-1"
          >
            Annuler
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleConfirmDelete}
          >
            Confirmer la suppression
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Modal pour l'ajout/modification d'enseignant */}
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