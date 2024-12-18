import React from 'react';
import { useAppSelector } from '../../app/hooks';

export const DepartmentOutput = () => {
  const { departmentOutputs = [] } = useAppSelector(state => state.surveillance);

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">Output par département</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left">Enseignant</th>
              <th className="px-4 py-2 text-center">Matin</th>
              <th className="px-4 py-2 text-center">Après-midi</th>
            </tr>
          </thead>
          <tbody>
            {departmentOutputs && departmentOutputs.length > 0 ? (
              departmentOutputs.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="px-4 py-2">{item.teacher}</td>
                  <td className="px-4 py-2 text-center">{item.morning}</td>
                  <td className="px-4 py-2 text-center">{item.afternoon}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="px-4 py-2 text-center text-gray-500">
                  Aucune donnée disponible
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
