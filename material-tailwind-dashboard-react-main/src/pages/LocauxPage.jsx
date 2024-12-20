import React, { useState } from 'react';
import { 
  useGetLocauxQuery,
  useCreateLocalMutation,
  useUpdateLocalMutation,
  useDeleteLocalMutation
} from '../features/local/localSlice';
import Papa from 'papaparse';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const LocauxPage = () => {
  const { data: locaux = [], isLoading, refetch } = useGetLocauxQuery();
  const [createLocal] = useCreateLocalMutation();
  const [updateLocal] = useUpdateLocalMutation();
  const [deleteLocal] = useDeleteLocalMutation();
  
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    nom: '',
    capacite: '',
    type: 'salle',
    nbSurveillants: 0,
    estDisponible: true
  });

  const handleCSVUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'text/csv') {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const csvData = e.target.result;
        
        Papa.parse(csvData, {
          header: true,
          complete: async (results) => {
            try {
              const locauxData = results.data
                .filter(row => row && row.nom)
                .map(row => {
                  const capacite = parseInt(row.capacite);
                  const nbSurveillants = parseInt(row.nbSurveillants);
                  let estDisponible = true;

                  if (typeof row.estDisponible === 'string') {
                    estDisponible = row.estDisponible.toLowerCase() === 'true';
                  } else if (typeof row.estDisponible === 'boolean') {
                    estDisponible = row.estDisponible;
                  }

                  return {
                    nom: (row.nom || '').trim(),
                    capacite: isNaN(capacite) ? 0 : capacite,
                    type: row.type ? row.type.trim() : 'Salle de classe',
                    nbSurveillants: isNaN(nbSurveillants) ? 0 : nbSurveillants,
                    estDisponible: estDisponible
                  };
                });

              const response = await fetch('http://localhost:8888/SERVICE-DEPARTEMENT/locaux/saveAll', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(locauxData)
              });

              if (response.ok) {
                setShowSuccessDialog(true);
                refetch();
              } else {
                const errorData = await response.json();
                alert('Erreur lors de l\'importation: ' + errorData.message);
              }
            } catch (error) {
              console.error('Erreur lors de l\'importation:', error);
              alert('Erreur lors de l\'importation du fichier CSV');
            }
          },
          error: (error) => {
            console.error('Erreur lors de la lecture du CSV:', error);
            alert('Erreur lors de la lecture du fichier CSV');
          }
        });
      };

      reader.readAsText(file);
    } else {
      alert('Veuillez sélectionner un fichier CSV');
    }
  };

  const filteredLocaux = locaux.filter((local) =>
    local.nom.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddOrUpdate = async () => {
    try {
      if (formData.id) {
        await updateLocal({
          id: formData.id,
          ...formData
        }).unwrap();
      } else {
        await createLocal(formData).unwrap();
      }
      setShowDialog(false);
      resetForm();
    } catch (error) {
      console.error('Failed to save local:', error);
    }
  };

  const handleEdit = (local) => {
    setFormData({
      id: local.id,
      nom: local.nom,
      capacite: local.capacite,
      type: local.type,
      nbSurveillants: local.nbSurveillants,
      estDisponible: local.estDisponible
    });
    setShowDialog(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce local ?')) {
      try {
        await deleteLocal(id).unwrap();
      } catch (error) {
        console.error('Failed to delete local:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id: null,
      nom: '',
      capacite: '',
      type: 'salle',
      nbSurveillants: 0,
      estDisponible: true
    });
  };

  if (isLoading) return <div>Chargement...</div>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Locaux ({locaux.length})</h1>
        <div className="flex gap-4">
          <button
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            onClick={() => {
              resetForm();
              setShowDialog(true);
            }}
          >
            + Ajouter un nouveau local
          </button>
          
          <div>
            <input 
              type="file" 
              accept=".csv"
              onChange={handleCSVUpload}
              className="hidden"
              id="csvInput"
            />
            <button
              onClick={() => document.getElementById('csvInput').click()}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-400"
            >
              Importer CSV
            </button>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead>
            <tr className="text-left border-b">
              <th className="p-3">Nom</th>
              <th className="p-3">Capacité</th>
              <th className="p-3">Type</th>
              <th className="p-3">Surveillants</th>
              <th className="p-3">Disponible</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLocaux.map((local) => (
              <tr key={local.id} className="hover:bg-gray-100 border-b last:border-b-0">
                <td className="p-3">{local.nom}</td>
                <td className="p-3">{local.capacite}</td>
                <td className="p-3">{local.type}</td>
                <td className="p-3">{local.nbSurveillants}</td>
                <td className="p-3">{local.estDisponible ? '✓' : '✗'}</td>
                <td className="p-3 space-x-2">
                  <button
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    onClick={() => handleEdit(local)}
                  >
                    Modifier
                  </button>
                  <button
                    className="px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    onClick={() => handleDelete(local.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog pour ajouter/modifier un local */}
      {showDialog && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          <div className="fixed inset-0 bg-gray-800 bg-opacity-50 z-[9999]"></div>
          <div className="relative z-[10000] bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">
              {formData.id ? 'Modifier le local' : 'Ajouter un local'}
            </h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Nom"
                value={formData.nom}
                onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Capacité"
                value={formData.capacite}
                onChange={(e) => setFormData({ ...formData, capacite: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full p-2 border rounded"
              >
                <option value="salle">Salle</option>
                <option value="amphi">Amphi</option>
              </select>
              <input
                type="number"
                placeholder="Nombre de surveillants"
                value={formData.nbSurveillants}
                onChange={(e) => setFormData({ ...formData, nbSurveillants: Number(e.target.value) })}
                className="w-full p-2 border rounded"
              />
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.estDisponible}
                    onChange={(e) => setFormData({ ...formData, estDisponible: e.target.checked })}
                    className="mr-2"
                  />
                  Disponible
                </label>
              </div>
            </div>
            <div className="flex justify-end mt-6 space-x-2">
              <button
                className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
                onClick={() => setShowDialog(false)}
              >
                Annuler
              </button>
              <button
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                onClick={handleAddOrUpdate}
              >
                Enregistrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de succès pour l'importation CSV */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Importation réussie</AlertDialogTitle>
          </AlertDialogHeader>
          <p>Les locaux ont été importés avec succès.</p>
          <AlertDialogFooter>
            <AlertDialogAction className="bg-black text-white hover:bg-gray-800">
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default LocauxPage;