import React from "react";

export default function DeleteModal({ onClose, onDelete }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-center">Confirmer la Suppression</h2>
        <p className="text-center text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer cette option ? Cette action est irréversible.
        </p>
        <div className="flex justify-center space-x-2">
          <button
            onClick={onClose}
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={onDelete}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
