// src/components/surveillance/SurveillanceModal.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPeriod } from '../../features/surveillance/surveillanceSlice';

export const SurveillanceModal = () => {
  const dispatch = useDispatch();
  const { selectedPeriod } = useSelector(state => state.surveillance);

  if (!selectedPeriod) return null;

  const examData = {
    modules: [
      {
        name: 'Chimie des électrolytes',
        option: 'deuxième année chimie physique et a',
        seance: 'S 1',
        responsable: 'SALHI ANAS',
        local: 'B',
        surveillants: ['NOUJDINAM', 'BOOMIHI', 'EL MEJDOUBI', 'GUESSOUS']
      },
      {
        name: 'Chimie des électrolytes',
        option: 'deuxième année chimie physique et a',
        seance: 'S 1',
        responsable: 'SALHI ANAS',
        local: 'NQ',
        surveillants: ['NOUJDINAM', 'BOOMIHI', 'EL MEJDOUBI', 'GUESSOUS']
      }
    ]
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 h-full">
      <div className="bg-white rounded-lg w-full max-w-4xl">
        <div className="flex justify-between items-start p-4 border-b">
          <div className="flex items-start gap-4">
            <img src="/logo-fac.png" alt="Faculté des Sciences" className="h-16" />
            <div>
              <p>date: {selectedPeriod.date}</p>
              <p>Période: {selectedPeriod.period}</p>
            </div>
          </div>
          <button 
            onClick={() => dispatch(selectPeriod(null))}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Module</th>
                <th className="border px-4 py-2">Local</th>
                <th className="border px-4 py-2">Surveillance</th>
              </tr>
            </thead>
            <tbody>
              {examData.modules.map((module, idx) => (
                <tr key={idx}>
                  <td className="border px-4 py-2">
                    <div>Module: {module.name}</div>
                    <div>Option: {module.option}</div>
                    <div>Séance: {module.seance}</div>
                    <div>Responsable: {module.responsable}</div>
                  </td>
                  <td className="border px-4 py-2 text-center">
                    {module.local}
                  </td>
                  <td className="border px-4 py-2">
                    <div className="flex flex-col items-center">
                      {module.surveillants.map((surveillant, sIdx) => (
                        <div key={sIdx} className="relative line-through">
                          {surveillant}
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
