import React from "react";

export default function AddOptionModal({
  isOpen,
  onClose,
  onSubmit,
  newOption,
  setNewOption,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Ajouter une Option</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          {/* Form Fields */}
          <div className="mb-4">
            <label htmlFor="nomDeFiliere" className="block text-sm font-medium text-gray-700">
              Nom Filière
            </label>
            <input
              type="text"
              id="nomDeFiliere"
              value={newOption.nomDeFiliere}
              onChange={(e) => setNewOption({ ...newOption, nomDeFiliere: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          {/* Other Fields */}
          <div className="mb-4">
            <label htmlFor="annee" className="block text-sm font-medium text-gray-700">
              Niveau d'année
            </label>
            <select
              id="annee"
              value={newOption.annee}
              onChange={(e) => setNewOption({ ...newOption, annee: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
            >
              <option value="1">1ère année</option>
              <option value="2">2ème année</option>
              <option value="3">3ème année</option>
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="nbrInscrit" className="block text-sm font-medium text-gray-700">
              Nombre d'étudiants Inscrits
            </label>
            <input
              type="number"
              id="nbrInscrit"
              value={newOption.nbrInscrit}
              onChange={(e) => setNewOption({ ...newOption, nbrInscrit: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
