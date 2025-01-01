import React from "react";
import { ArrowUpRight } from "lucide-react";

export default function OptionsTable({ options, onOptionClick, onEdit, onDelete }) {
  console.log("Options reçues:", options); // Pour déboguer

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="table-auto w-full text-left border-collapse">
        <thead className="bg-gray-50 text-gray-800">
          <tr>
            <th className="px-4 py-3 font-medium">Nom de filière</th>
            <th className="px-4 py-3 font-medium">Niveau d'Année</th>
            <th className="px-4 py-3 font-medium">Nombre d'étudiants</th>
            <th className="px-4 py-3 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {options && options.map((option) => (
            <tr
              key={option.id}
              className="border-t border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <td className="px-4 py-3 text-blue-600" onClick={() => onOptionClick(option.id)}>
                {option.nomDeFiliere || option.nomOption}
              </td>
              <td className="px-4 py-3">
                {option.annee || option.niveauAnnee}
              </td>
              <td className="px-4 py-3">
                {option.nbrInscrit || option.nombreEtudiant}
              </td>
              <td className="px-4 py-3 space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(option);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Modifier
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(option.id);
                  }}
                  className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
          {(!options || options.length === 0) && (
            <tr>
              <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                Aucune option trouvée
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}