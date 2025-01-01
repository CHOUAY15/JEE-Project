import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useGetOptionsQuery } from "../features/options/optionSlice";
import { useGetDepartmentsQuery } from "../features/department/departmentSlice";
import { useGetDepartmentTeachersQuery } from "../features/teacher/teacherSlice";
import { ArrowLeft } from "lucide-react";
import {
  useGetModulesQuery,
  useGetModulesByOptionQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation
} from '../features/modules/moduleSlice';
import { useEffect } from "react";

export default function ModulePages() {
  const { optionId } = useParams();
  const navigate = useNavigate();
  
  const { data: options = [] } = useGetOptionsQuery();
  const { data: modules = [], isLoading } = useGetModulesByOptionQuery(optionId);
  const [createModule] = useCreateModuleMutation();
  const [updateModule] = useUpdateModuleMutation();
  const [deleteModule] = useDeleteModuleMutation();
  const { data: departments = [] } = useGetDepartmentsQuery();
  const [selectedDepartmentId, setSelectedDepartmentId] = useState("");
  const { data: teachers = [] } = useGetDepartmentTeachersQuery(selectedDepartmentId, {
    skip: !selectedDepartmentId
  });
  const option = options.find((opt) => opt.id === parseInt(optionId));
  const filteredModules = modules.filter((mod) => mod.option?.id === parseInt(optionId));

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    responsableNom: "",
    departementId: "",
    option: { id: parseInt(optionId) }
  });

  const [editModuleData, setEditModuleData] = useState(null);

  const getTeacherName = async (teacherId) => {
    try {
      const response = await fetch(`http://localhost:8888/SERVICE-DEPARTEMENT/enseignants/${teacherId}`);
      const teacher = await response.json();
      return `${teacher.nom} ${teacher.prenom}`;
    } catch (error) {
      return `Responsable ID: ${teacherId}`;
    }
  };

  const [teacherNames, setTeacherNames] = useState({});

// Charger les noms des enseignants quand les modules changent
useEffect(() => {
  const loadTeacherNames = async () => {
    const names = {};
    for (const module of modules) {
      if (module.responsableId) {
        names[module.responsableId] = await getTeacherName(module.responsableId);
      }
    }
    setTeacherNames(names);
  };
  loadTeacherNames();
}, [modules]);


  const handleAddModule = async (e) => {
    e.preventDefault();
    try {
      const selectedTeacher = teachers.find(t => t.nom === formData.responsableNom);
      if (!selectedTeacher) {
        alert("Veuillez sélectionner un responsable valide");
        return;
      }

      await createModule({
        nom: formData.nom,
        responsableId: selectedTeacher.id,
        option: { id: parseInt(optionId) }
      }).unwrap();

      setShowAddDialog(false);
      setFormData({
        nom: "",
        responsableNom: "",
        departementId: "",
        option: { id: parseInt(optionId) }
      });
    } catch (error) {
      console.error("Failed to create module:", error);
    }
  };
  const handleEditModule = async (e) => {
    e.preventDefault();
    if (!editModuleData?.id) return;

    try {
      await updateModule({
        id: editModuleData.id,
        ...editModuleData
      }).unwrap();
      setShowEditDialog(false);
      setEditModuleData(null);
    } catch (error) {
      console.error("Failed to update module:", error);
    }
  };

  useEffect(() => {
    if (option?.departementId) {
      setSelectedDepartmentId(option.departementId);
    }
  }, [option]);

  const handleDeleteModule = async () => {
    if (!moduleToDelete?.id) return;

    try {
      await deleteModule(moduleToDelete.id).unwrap();
      setShowDeleteDialog(false);
      setModuleToDelete(null);
    } catch (error) {
      console.error("Failed to delete module:", error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  if (!option) {
    return (
      <div className="p-4">
        <button
          onClick={() => navigate("/dashboard/options")}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Retour aux options
        </button>
        <div className="mt-4 text-red-600">Option non trouvée</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4 relative">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/dashboard/options")}
          className="mr-4 p-2 hover:bg-gray-200 rounded-full"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold">{option.nomOption} - Modules</h1>
      </div>

      <button
        onClick={() => setShowAddDialog(true)}
        className="absolute top-4 right-4 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
      >
        Ajouter un module
      </button>

      {/* Liste des modules */}
      <div className="bg-white shadow-md rounded-lg p-4 mt-6">
        <h2 className="text-lg font-bold mb-4">Liste des modules</h2>
        {modules.length === 0 ? (
          <p className="text-gray-500">Aucun module trouvé</p>
        ) : (
          <ul>
            {modules.map((module) => (
              <li key={module.id} className="flex justify-between items-center border-b py-2">
                <div>
                  <strong>{module.nom}</strong> 
                  {module.responsableId && ` - ${teacherNames[module.responsableId] || 'Chargement...'}`}
                                  </div>
                <div className="space-x-2">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setEditModuleData(module);
                      setShowEditDialog(true);
                    }}
                  >
                    Modifier
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800"
                    onClick={() => {
                      setModuleToDelete(module);
                      setShowDeleteDialog(true);
                    }}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add Module Dialog */}
      {showAddDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-4">Ajouter un module</h2>
      <form onSubmit={handleAddModule}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nom du module
          </label>
          <input
            type="text"
            value={formData.nom}
            onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Responsable
          </label>
          <select
            value={formData.responsableNom}
            onChange={(e) => setFormData({ ...formData, responsableNom: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Sélectionnez un responsable</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.nom}>
                {teacher.nom} {teacher.prenom}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => setShowAddDialog(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Ajouter
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Edit Module Dialog */}
     {/* Edit Module Dialog */}
     {showEditDialog && (
  <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg w-96">
      <h2 className="text-lg font-bold mb-4">Modifier un module</h2>
      <form onSubmit={handleEditModule}>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Nom du module
          </label>
          <input
            type="text"
            value={editModuleData.nom}
            onChange={(e) => setEditModuleData({ ...editModuleData, nom: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Responsable
          </label>
          <select
            value={editModuleData.responsableId || ''}
            onChange={(e) => setEditModuleData({ ...editModuleData, responsableId: e.target.value })}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          >
            <option value="">Sélectionnez un responsable</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>
                {teacher.nom} {teacher.prenom}
              </option>
            ))}
          </select>
        </div>

        <div className="flex justify-between mt-6">
          <button
            type="button"
            onClick={() => {
              setShowEditDialog(false);
              setEditModuleData(null);
            }}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          >
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
)}

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-lg font-bold mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer ce module ? Cette action est irréversible.
            </p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowDeleteDialog(false);
                  setModuleToDelete(null);
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteModule}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
