import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { DepartmentItem } from './DepartmentItem';

export const DepartmentList = () => {
  const departments = useAppSelector(state => state.departments.departments);

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="grid grid-cols-1 divide-y">
        {departments.map((department) => (
          <DepartmentItem key={department.id} department={department} />
        ))}
      </div>
    </div>
  );
};
