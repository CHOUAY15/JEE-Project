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
  const { data: departments = [], isLoading, refetch } = useGetDepartmentsQuery();
  const [createDepartment] = useCreateDepartmentMutation();
  const [updateDepartment] = useUpdateDepartmentMutation();
  const [deleteDepartment] = useDeleteDepartmentMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [uploadStatus, setUploadStatus] = useState({ show: false, success: false, message: '' });

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
      refetch();
    } catch (error) {
      console.error('Failed to save department:', error);
    }
  };

  const handleDepartmentClick = (dept) => {
    console.log("Département cliqué:", dept.id);
    navigate(`/dashboard/departements/${dept.id}/teachers`);
  };

  const handleEdit = (department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (departmentId) => {
    try {
      await deleteDepartment(departmentId).unwrap();
      refetch();
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const formData = new FormData();
      formData.append('file', file);
      uploadCSV(formData);
    } else {
      setUploadStatus({
        show: true,
        success: false,
        message: 'Veuillez sélectionner un fichier CSV valide'
      });
      setTimeout(() => setUploadStatus({ show: false, success: false, message: '' }), 3000);
    }
  };

  const uploadCSV = async (formData) => {
    try {
      const response = await fetch('http://localhost:8888/SERVICE-DEPARTEMENT/departements/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setUploadStatus({
          show: true,
          success: true,
          message: 'Départements importés avec succès'
        });
        refetch();
      } else {
        const errorData = await response.json();
        setUploadStatus({
          show: true,
          success: false,
          message: 'Erreur lors de l\'importation du fichier CSV: ' + errorData.message
        });
      }
      setTimeout(() => setUploadStatus({ show: false, success: false, message: '' }), 3000);
    } catch (error) {
      console.error('Failed to import CSV:', error);
      setUploadStatus({
        show: true,
        success: false,
        message: 'Erreur lors de l\'importation du fichier CSV'
      });
      setTimeout(() => setUploadStatus({ show: false, success: false, message: '' }), 3000);
    }
  };

  if (isLoading) {
    return <div className="p-4">Chargement...</div>;
  }

  return (
    <div className="space-y-6 p-4">
      {uploadStatus.show && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg ${
          uploadStatus.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {uploadStatus.message}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Départements ({departments.length})</h1>
        <div className="flex gap-4">
          <button
            onClick={() => {
              setIsModalOpen(true);
              setSelectedDepartment(null);
            }}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            + Ajouter un nouveau département
          </button>
          <div>
            <input 
              type="file" 
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
            />
            <button
              onClick={() => document.querySelector('input[type="file"]').click()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            >
              Importer un fichier CSV
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="space-y-3">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-gray-50 rounded-lg p-4 flex justify-between items-center hover:bg-gray-100 transition-colors duration-200 border border-gray-100"
            >
              <span
                className="text-blue-600 underline cursor-pointer font-medium"
                onClick={() => handleDepartmentClick(dept)}
              >
                {dept.nom}
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dept)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDelete(dept.id)}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
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