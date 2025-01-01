import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Papa from 'papaparse';
import { 
  useGetOptionsQuery,
  useCreateOptionMutation,
  useUpdateOptionMutation,
  useDeleteOptionMutation,
  useImportOptionsMutation
} from "../features/options/optionSlice";
import { useGetDepartmentsQuery } from "../features/department/departmentSlice";

import OptionsTable from "../components/option/OptionsTable";
import AddModal from "../components/option/AddModal";
import EditModal from "../components/option/EditModal";
import DeleteModal from "../components/option/DeleteModal";

export default function OptionsPage() {
  const navigate = useNavigate();
  const { data: options = [], isLoading, refetch } = useGetOptionsQuery();
  const [createOption] = useCreateOptionMutation();
  const [updateOption] = useUpdateOptionMutation();
  const [deleteOption] = useDeleteOptionMutation();
  const [importOptions] = useImportOptionsMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [optionToDelete, setOptionToDelete] = useState(null);
  
  const [newOption, setNewOption] = useState({
    nomOption: "",
    niveauAnnee: "",
    nombreEtudiant: 0,
    modules: []
  });
  
  const { data: departments = [] } = useGetDepartmentsQuery();
  
  const [editOption1, setEditOption1] = useState({
    id: "",
    nomOption: "",
    niveauAnnee: "",
    nombreEtudiant: 0,
    modules: []
  });

  const [filteredOptions, setFilteredOptions] = useState([]);

  useEffect(() => {
    const filtered = options.filter((option) =>
      [option.nomOption, option.niveauAnnee, option.nombreEtudiant?.toString()]
        .filter(Boolean)
        .map(field => field.toLowerCase())
        .some((field) => field.includes(searchTerm.toLowerCase()))
    );
    setFilteredOptions(filtered);
  }, [options, searchTerm]);

  const handleAddOption = async () => {
    try {
      await createOption(newOption).unwrap();
      setIsAddModalOpen(false);
      setNewOption({ nomOption: "", niveauAnnee: "", nombreEtudiant: 0, modules: [] });
      refetch();
    } catch (error) {
      console.error("Failed to create option:", error);
    }
  };

  const handleEditOption = async () => {
    if (!editOption1.id) {
      console.error("Edit option is missing an ID");
      return;
    }
    
    try {
      await updateOption({
        id: editOption1.id,
        nomOption: editOption1.nomOption,
        niveauAnnee: editOption1.niveauAnnee,
        nombreEtudiant: editOption1.nombreEtudiant
      }).unwrap();
      
      setIsEditModalOpen(false);
      setEditOption1({ id: "", nomOption: "", niveauAnnee: "", nombreEtudiant: 0, modules: [] });
      refetch();
    } catch (error) {
      console.error("Failed to update option:", error);
    }
  };

  const handleDeleteOption = async () => {
    if (!optionToDelete) return;
    
    try {
      await deleteOption(optionToDelete).unwrap();
      setIsDeleteModalOpen(false);
      setOptionToDelete(null);
      refetch();
    } catch (error) {
      console.error("Failed to delete option:", error);
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
  
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          console.log('Parsed CSV Data:', results.data);
          
          const formattedData = results.data.map(row => ({
            nomOption: row.nomOption || '',
            niveauAnnee: row.niveauAnnee || '',
            nombreEtudiant: parseInt(row.nombreEtudiant) || 0,
            departementId:row.departementId || '',
            modules: []
          }));
          
          console.log('Formatted Data for Import:', formattedData);
  
          await importOptions(formattedData).unwrap();
          refetch();
          event.target.value = '';
        } catch (error) {
          console.error('Import error:', error);
        }
      },
      error: (error) => {
        console.error('CSV parsing error:', error);
      }
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Options ({filteredOptions.length})</h1>
        <div className="flex gap-4">
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors duration-200"
            onClick={() => setIsAddModalOpen(true)}
          >
            + Ajouter une nouvelle option
          </button>
          <div className="relative">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
              id="csvFileInput"
            />
            <button
              onClick={() => document.getElementById('csvFileInput').click()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors duration-200"
            >
              Importer CSV
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition duration-200"
        />
      </div>

      <OptionsTable
        options={filteredOptions}
        onOptionClick={(optionId) => navigate(`/dashboard/modules/${optionId}`)}
        onEdit={(option) => {
          setEditOption1({
            id: option.id,
            nomOption: option.nomOption,
            niveauAnnee: option.niveauAnnee,
            nombreEtudiant: option.nombreEtudiant
          });
          setIsEditModalOpen(true);
        }}
        onDelete={(id) => {
          setOptionToDelete(id);
          setIsDeleteModalOpen(true);
        }}
      />

      {/* Modals */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <AddModal
              newOption={newOption}
              setNewOption={setNewOption}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddOption}
              departments={departments} // Ajoutez cette prop

            />
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <EditModal
              editOption1={editOption1}
              setEditOption1={setEditOption1}
              onClose={() => setIsEditModalOpen(false)}
              onEdit={handleEditOption}
            />
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <DeleteModal
              onClose={() => {
                setIsDeleteModalOpen(false);
                setOptionToDelete(null);
              }}
              onDelete={handleDeleteOption}
            />
          </div>
        </div>
      )}
    </div>
  );
}