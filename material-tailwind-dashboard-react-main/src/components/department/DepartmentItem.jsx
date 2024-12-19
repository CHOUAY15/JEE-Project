import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { removeDepartment } from '../../features/department/departmentSlice';

export const DepartmentItem = ({ department }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-between p-4 hover:bg-gray-50">
      <div>
        <h3 className="font-medium text-gray-900">{department.name}</h3>
        <p className="text-sm text-gray-500">
          {department.teacherCount || 0} enseignants
        </p>
      </div>
      <div className="flex items-center space-x-4">
        <button
          className="text-blue-600 hover:text-blue-800 text-sm"
          onClick={() => {/* Logique pour éditer */}}
        >
          Éditer
        </button>
        <button
          className="text-red-600 hover:text-red-800 text-sm"
          onClick={() => dispatch(removeDepartment(department.id))}
        >
          Supprimer
        </button>
      </div>
    </div>
  );
};
