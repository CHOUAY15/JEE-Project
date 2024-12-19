import React from 'react';
import { useAppSelector } from '../../app/hooks';
import { ExamItem } from './ExamItem';

export const ExamList = () => {
  const exams = useAppSelector(state => state.exams.exams);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left">Date</th>
              <th className="px-4 py-2 text-left">Module</th>
              <th className="px-4 py-2 text-left">Responsable</th>
              <th className="px-4 py-2 text-center">Étudiants</th>
              <th className="px-4 py-2 text-left">Local</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam) => (
              <ExamItem key={exam.id} exam={exam} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
