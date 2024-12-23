import React from 'react';

export const SelectedLocaux = ({ selectedLocaux, locaux }) => {
  if (selectedLocaux.length === 0) return null;

  const totalCapacity = selectedLocaux.reduce((sum, localId) => {
    const local = locaux.find(l => l.id === localId);
    return sum + (local?.capacite || 0);
  }, 0);

  return (
    <div className="border rounded p-2 bg-blue-50">
      <div className="font-medium mb-2 text-sm">Locaux sélectionnés:</div>
      <div className="space-y-2">
        {selectedLocaux.map(localId => {
          const local = locaux.find(l => l.id === localId);
          return (
            <div key={localId} className="flex justify-between items-center text-sm">
              <span>{local?.nom} ({local?.type})</span>
              <span className="text-gray-600">Capacité: {local?.capacite}</span>
            </div>
          );
        })}
        <div className="border-t pt-2 mt-2">
          <div className="flex justify-between text-sm font-medium">
            <span>Capacité totale:</span>
            <span>{totalCapacity} places</span>
          </div>
        </div>
      </div>
    </div>
  );
};