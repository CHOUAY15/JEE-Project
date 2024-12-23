import React from 'react';

export const LocalSearchAndFilter = ({ searchValue, typeValue, onSearchChange, onTypeChange }) => {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        placeholder="Rechercher un local..."
        value={searchValue}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 px-3 py-2 border rounded focus:ring-2 focus:ring-black"
      />
      <select
        value={typeValue}
        onChange={(e) => onTypeChange(e.target.value)}
        className="px-3 py-2 border rounded focus:ring-2 focus:ring-black"
      >
        <option value="">Tous les types</option>
        <option value="salle">Salle</option>
        <option value="amphi">Amphi</option>
      </select>
    </div>
  );
};