import React from 'react';

export const LocalSelectionMode = ({ mode, onChange }) => {
  return (
    <div className="flex space-x-4 border rounded p-2 bg-gray-50">
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="localAssignment"
          value="auto"
          checked={mode === 'auto'}
          onChange={(e) => onChange(e.target.value)}
          className="mr-2 h-4 w-4 text-black focus:ring-black"
        />
        <span className="text-sm">Attribution automatique</span>
      </label>
      <label className="flex items-center cursor-pointer">
        <input
          type="radio"
          name="localAssignment"
          value="manual"
          checked={mode === 'manual'}
          onChange={(e) => onChange(e.target.value)}
          className="mr-2 h-4 w-4 text-black focus:ring-black"
        />
        <span className="text-sm">Sélection manuelle</span>
      </label>
    </div>
  );
};