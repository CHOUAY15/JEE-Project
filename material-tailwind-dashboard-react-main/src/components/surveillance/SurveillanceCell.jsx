import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSurveillance } from '../../features/surveillance/surveillanceSlice';
import { 
  useGetLocauxDisponiblesQuery,
  useAssignSurveillantMutation,
  useGetExamensQuery
} from '../../features/surveillance/surveillanceAPI';

export const SurveillanceCell = ({ teacher, date, timeSlot, selectedCell, setSelectedCell }) => {
  const dispatch = useDispatch();
  const selectedSession = useSelector(state => state.exams.selectedSession);

  const [showMenu, setShowMenu] = useState(false);
  const [showLocalMenu, setShowLocalMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedExamen, setSelectedExamen] = useState(null);

  // Fetch available locaux
  const { data: locauxDisponibles = [] } = useGetLocauxDisponiblesQuery({
    date,
    horaire: timeSlot
  }, { skip: !showLocalMenu });

  // Fetch examens for this timeslot
  const { data: examens = [] } = useGetExamensQuery({
    date,
    horaire: timeSlot,
    sessionId: selectedSession?.id
  }, { skip: !showLocalMenu });

  // Mutation for assigning surveillant
  const [assignSurveillant] = useAssignSurveillantMutation();

  const cellStatus = useSelector(state => {
    const key = `${teacher.id}-${date}-${timeSlot}`;
    return state.surveillance.surveillances[key];
  });

  const handleCellClick = (e) => {
    e.stopPropagation();
    const currentCell = `${teacher.id}-${date}-${timeSlot}`;

    if (selectedCell === currentCell) {
      setShowMenu(!showMenu);
      setShowLocalMenu(false);
    } else {
      const rect = e.currentTarget.getBoundingClientRect();
      setMenuPosition({
        x: rect.left,
        y: rect.bottom + window.scrollY
      });
      setSelectedCell(currentCell);
      setShowMenu(true);
      setShowLocalMenu(false);
    }
  };

  const handleStatusSelect = async (newStatus, e) => {
    e.stopPropagation();
    
    if (newStatus === 'LOCAL') {
      setShowLocalMenu(true);
      setShowMenu(false);
    } else if (newStatus === 'TT' || newStatus === 'RR') {
      dispatch(setSurveillance({
        teacherId: teacher.id,
        date,
        timeSlot,
        status: newStatus
      }));
      setShowMenu(false);
      setShowLocalMenu(false);
    } else if (newStatus === '') {
      dispatch(setSurveillance({
        teacherId: teacher.id,
        date,
        timeSlot,
        status: ''
      }));
      setShowMenu(false);
      setShowLocalMenu(false);
    } else {
      // C'est un local qui a été sélectionné
      try {
        if (!selectedExamen) {
          alert("Veuillez d'abord sélectionner un examen");
          return;
        }

        await assignSurveillant({
          examenId: selectedExamen,
          enseignantId: teacher.id,
          localId: newStatus,
          typeSurveillant: 'PRINCIPAL'
        }).unwrap();

        dispatch(setSurveillance({
          teacherId: teacher.id,
          date,
          timeSlot,
          status: newStatus
        }));

        setShowMenu(false);
        setShowLocalMenu(false);
      } catch (error) {
        console.error('Failed to assign surveillant:', error);
        alert('Erreur lors de l\'assignation du surveillant');
      }
    }
  };

  const handleClickOutside = (e) => {
    if (!e.target.closest('.cell') && !e.target.closest('.menu')) {
      setShowMenu(false);
      setShowLocalMenu(false);
    }
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <td
      className="border px-4 py-2 text-center cursor-pointer hover:bg-gray-100 relative cell"
      onClick={handleCellClick}
    >
      {cellStatus || '-'}

      {selectedCell === `${teacher.id}-${date}-${timeSlot}` && showMenu && (
        <div
          className="fixed bg-white shadow-lg rounded-lg z-50 border menu"
          style={{
            top: `${menuPosition?.y || 0}px`,
            left: `${menuPosition?.x || 0}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-2">
            <button
              onClick={(e) => handleStatusSelect('TT', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              TT
            </button>
            <button
              onClick={(e) => handleStatusSelect('RR', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              RR
            </button>
            <button
              onClick={(e) => handleStatusSelect('LOCAL', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Choisir local
            </button>
            <button
              onClick={(e) => handleStatusSelect('', e)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
            >
              Effacer
            </button>
          </div>
        </div>
      )}

      {selectedCell === `${teacher.id}-${date}-${timeSlot}` && showLocalMenu && (
        <div
          className="fixed bg-white shadow-lg rounded-lg z-50 border menu"
          style={{
            top: `${menuPosition?.y || 0}px`,
            left: `${menuPosition?.x || 0}px`,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Examen</label>
              <select
                className="w-full border rounded p-2"
                value={selectedExamen}
                onChange={(e) => setSelectedExamen(e.target.value)}
                required
              >
                <option value="">Sélectionner un examen</option>
                {examens.map(examen => (
                  <option key={examen.id} value={examen.id}>
                    {examen.module.nom} - {examen.option.nomOption}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-2 font-medium">Locaux disponibles</div>
            <div className="max-h-60 overflow-y-auto">
              {locauxDisponibles.map(local => (
                <button
                  key={local.id}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 rounded"
                  onClick={(e) => handleStatusSelect(local.id, e)}
                >
                  {local.nom} (Capacité: {local.capacite})
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </td>
  );
};