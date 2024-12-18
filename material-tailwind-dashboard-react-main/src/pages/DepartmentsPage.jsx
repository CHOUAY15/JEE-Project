import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetDepartmentsQuery, 
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation 
} from '../features/department/departmentSlice';
import { DepartmentManager } from '../components/department/DepartmentManager';

const DepartmentsPage = () => {
  const navigate = useNavigate();
  const { data: departments = [], isLoading } = useGetDepartmentsQuery();
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleSaveDepartment = async (departmentData) => {
    try {
      if (selectedDepartment) {
        await updateDepartment({ 
          id: selectedDepartment.id, 
          nom: departmentData.name 
        }).unwrap();
      } else {
        await createDepartment({ 
          nom: departmentData.name 
        }).unwrap();
      }
      setIsModalOpen(false);
      setSelectedDepartment(null);
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  // Dans DepartmentsPage.jsx
  const handleDepartmentClick = (dept) => {
    console.log("Département cliqué:", dept.id);
    navigate(`/dashboard/departements/${dept.id}/teachers`); // Utiliser l'ID directement
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
    setActiveDropdown(null);
  };

  const handleDelete = async (departmentId) => {
    try {
      await deleteDepartment(departmentId).unwrap();
      setActiveDropdown(null);
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  const toggleDropdown = (id) => {
    setActiveDropdown((prev) => (prev === id ? null : id));
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Départements ({departments.length})</h1>
        <button
          onClick={() => {
            setIsModalOpen(true);
            setSelectedDepartment(null);
          }}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Ajouter un nouveau département
        </button>
      </div>

      <div className="space-y-2 border rounded p-2">
        {departments.map((dept) => (
          <div
            key={dept.id}
            className="cursor-pointer hover:bg-gray-100 p-2 flex justify-between items-center"
          >
            <span
              className="text-blue-600 underline"
              onClick={() => handleDepartmentClick(dept)}
            >
              {dept.nom}
            </span>

            <div className="relative">
              <button
                onClick={() => toggleDropdown(dept.id)}
                className="px-2 py-1 rounded hover:bg-gray-200"
              >
                ...
              </button>
              {activeDropdown === dept.id && (
                <div className="absolute right-0 mt-2 bg-white border shadow rounded z-10">
                  <button
                    onClick={() => handleEdit(dept)}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(dept.id)}
                    className="block px-4 py-2 hover:bg-gray-100 w-full text-left text-red-600"
                  >
                    Supprimer
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      <DepartmentManager
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedDepartment(null);
        }}
        onSave={handleSaveDepartment}
        department={selectedDepartment ? { name: selectedDepartment.nom } : null}
      />
    </div>
  );
};

export default DepartmentsPage;