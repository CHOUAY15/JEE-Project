import React, { useState } from 'react';
import { X } from 'lucide-react';
import Papa from 'papaparse';

const ImportCSVModal = ({ onClose, onImport }) => {
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type !== 'text/csv') {
      setError('Veuillez sélectionner un fichier CSV');
      setFile(null);
      return;
    }
    setError('');
    setFile(selectedFile);
  };

  const handleImport = async () => {
    if (!file) {
      setError('Veuillez sélectionner un fichier');
      return;
    }
  
    setLoading(true);
  
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const csvText = reader.result;
        const options = parseCSV(csvText);
        await onImport(options); // Pass the parsed options to onImport
        onClose();
      };
      reader.readAsText(file); // Read the CSV file
    } catch (err) {
      setError('Erreur lors de l\'importation: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const parseCSV = (csvText) => {
    const results = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const options = results.data.map((row) => ({
      nomOption: row.nomOption,
      niveauAnnee: row.niveauAnnee,
      nombreEtudiant: row.nombreEtudiant,
    }));

    return options;
  };

  return (
    <div className="w-full max-w-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Importer des options</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <div className="mb-4">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full p-2 border border-gray-300 rounded"
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleImport}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-700"
          disabled={loading}
        >
          {loading ? 'Importation en cours...' : 'Importer'}
        </button>
        <button
          onClick={onClose}
          className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400"
        >
          Annuler
        </button>
      </div>
    </div>
  );
};

export default ImportCSVModal;
