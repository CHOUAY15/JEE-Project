import React from 'react';

export const LocalList = ({ filteredLocaux, selectedLocaux, onLocalToggle }) => {
  return (
    <div className="max-h-40 overflow-y-auto border rounded p-2">
      {filteredLocaux.length > 0 ? (
        filteredLocaux.map(local => (
          <div key={local.id} className="flex items-center p-1">
            <input
              type="checkbox"
              id={`local-${local.id}`}
              checked={selectedLocaux.includes(local.id)}
              onChange={() => onLocalToggle(local.id)}
              className="mr-2"
            />
            <label htmlFor={`local-${local.id}`} className="flex-1 cursor-pointer">
              {local.nom} ({local.type}) - Capacité: {local.capacite}
            </label>
          </div>
        ))
      ) : (
        <p className="text-center text-gray-500 py-2">
          Aucun local disponible pour ce créneau
        </p>
      )}
    </div>
  );
};