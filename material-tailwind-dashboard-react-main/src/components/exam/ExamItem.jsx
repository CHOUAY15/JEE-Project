import React from 'react';
import { useAppDispatch } from '../../app/hooks';
import { removeExam } from '../../features/exam/examSlice';

export const ExamItem = ({ exam }) => {
  const dispatch = useAppDispatch();

  return (
    <tr className="border-t">
      <td className="px-4 py-2">{exam.date}</td>
      <td className="px-4 py-2">{exam.module}</td>
      <td className="px-4 py-2">{exam.responsable}</td>
      <td className="px-4 py-2 text-center">{exam.studentCount}</td>
      <td className="px-4 py-2">{exam.location}</td>
      <td className="px-4 py-2 text-center">
        <button
          onClick={() => dispatch(removeExam(exam.id))}
          className="text-red-600 hover:text-red-800"
        >
          Supprimer
        </button>
      </td>
    </tr>
  );
};