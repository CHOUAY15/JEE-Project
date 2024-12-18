import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSelectedCell } from '../../features/surveillance/surveillanceSlice';

export const SurveillanceDetail = ({ period, onClose }) => {
  if (!period) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-3xl">
        <div className="p-4 flex items-center justify-between border-b">
          <div className="flex items-center space-x-4">
            <img 
              src="/logo.png" 
              alt="Faculté des Sciences" 
              className="h-16"
            />
            <div>
              <div>date: {period.date}</div>
              <div>Période: {period.period}</div>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="p-4">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2 text-left">Module</th>
                <th className="border px-4 py-2 text-center">Local</th>
                <th className="border px-4 py-2 text-center">Surveillance</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">
                  <div className="space-y-1">
                    <div>Module: Chimie des électrolytes</div>
                    <div>Option: deuxième année chimie physique et a</div>
                    <div>Séance: S 1</div>
                    <div>Responsable: SALHI ANAS</div>
                  </div>
                </td>
                <td className="border px-4 py-2 text-center">B</td>
                <td className="border px-4 py-2 text-center">
                  {/* Liste des surveillants */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};