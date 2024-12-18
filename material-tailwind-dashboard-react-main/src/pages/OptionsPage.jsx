import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  useGetOptionsQuery,
  useCreateOptionMutation,
  useUpdateOptionMutation,
  useDeleteOptionMutation
} from "../features/options/optionSlice";
import OptionsTable from "../components/option/OptionsTable";
import AddModal from "../components/option/AddModal";
import EditModal from "../components/option/EditModal";
import DeleteModal from "../components/option/DeleteModal";

export default function OptionsPage() {
  const navigate = useNavigate();
  const { data: options = [], isLoading } = useGetOptionsQuery();
  const [createOption] = useCreateOptionMutation();
  const [updateOption] = useUpdateOptionMutation();
  const [deleteOption] = useDeleteOptionMutation();
console.log("hhhan",options)
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
  
  const [editOption1, setEditOption1] = useState({
    id: "",
    nomOption: "",
    niveauAnnee: "",
    nombreEtudiant: 0,
    modules: []
  });

  const filteredOptions = options.filter((option) =>
    [option.nomOption, option.niveauAnnee, option.nombreEtudiant]
      .map((field) => field.toString().toLowerCase())
      .some((field) => field.includes(searchTerm.toLowerCase()))
  );

  const handleAddOption = async () => {
    try {
      await createOption(newOption).unwrap();
      setIsAddModalOpen(false);
      setNewOption({ nomOption: "", niveauAnnee: "", nombreEtudiant: 0 });
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
      const updateData = {
        nomOption: editOption1.nomOption,
        niveauAnnee: editOption1.niveauAnnee,
        nombreEtudiant: editOption1.nombreEtudiant
      };
  
      await updateOption({
        id: editOption1.id,
        ...updateData
      }).unwrap();
      
      setIsEditModalOpen(false);
      setEditOption1({ id: "", nomOption: "", niveauAnnee: "", nombreEtudiant: 0 });
    } catch (error) {
      console.error("Failed to update option:", error);
    }
  };

  const handleDeleteOption = async () => {
    if (optionToDelete === null) return;
    try {
      await deleteOption(optionToDelete).unwrap();
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error("Failed to delete option:", error);
    }
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="bg-gray-100 p-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Options ({filteredOptions.length})</h1>
        <button
          className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800"
          onClick={() => setIsAddModalOpen(true)}
        >
          + Ajouter une nouvelle option
        </button>
      </div>

      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Rechercher..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <OptionsTable
        options={filteredOptions}
        onOptionClick={(optionId) => {
          console.log("Selected Option ID:", optionId);
          navigate(`/dashboard/modules/${optionId}`);
        }}
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

      {isAddModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-[10000] bg-white rounded-lg shadow-xl">
            <AddModal
              newOption={newOption}
              setNewOption={setNewOption}
              onClose={() => setIsAddModalOpen(false)}
              onAdd={handleAddOption}
            />
          </div>
        </div>
      )}

      {isEditModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-[10000] bg-white rounded-lg shadow-xl">
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
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-black bg-opacity-50"></div>
          <div className="relative z-[10000] bg-white rounded-lg shadow-xl">
            <DeleteModal
              onClose={() => setIsDeleteModalOpen(false)}
              onDelete={handleDeleteOption}
            />
          </div>
        </div>
      )}
    </div>
  );
}