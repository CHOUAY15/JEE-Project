import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectPeriod } from '../../features/surveillance/surveillanceSlice';
import { useGetExamensResQuery, useGetSurveillanceAssignmentsQuery } from '../../features/surveillance/surveillanceAPI';
import { useGetLocauxQuery } from '../../features/local/localSlice';
import { useGetAllTeachersQuery } from '../../features/teacher/teacherSlice';
import { Loader2 } from "lucide-react";
import logoensaj from "../../images/logoensaj.gif";


export const SurveillanceModal = () => {
  const dispatch = useDispatch();
  const selectedSession = useSelector(state => state.exams.selectedSession);
  const { selectedPeriod } = useSelector(state => state.surveillance);
  const { data: locaux = [] } = useGetLocauxQuery();
  const { data: teachers = [] } = useGetAllTeachersQuery();

  const { data: examens = [], isLoading: isLoadingExams } = useGetExamensResQuery({
    sessionId: selectedSession?.sessionId,
    date: selectedPeriod?.date,
    horaire: selectedPeriod?.period === 'Matin' ? '08:30-10:00' : '14:30-16:00'
  }, {
    skip: !selectedPeriod || !selectedSession?.sessionId
  });

  const { data: assignments = [], isLoading: isLoadingAssignments } = useGetSurveillanceAssignmentsQuery({
    sessionId: selectedSession?.sessionId
  }, {
    skip: !selectedSession?.sessionId
  });

  if (!selectedPeriod) return null;

  const isLoading = isLoadingExams || isLoadingAssignments;

  const examensWithSurveillants = examens.map(exam => {
    const examAssignments = assignments.filter(
      assignment => 
        assignment.examenId === exam.id &&
        assignment.date === exam.date &&
        assignment.horaire === exam.horaire
    );

    const surveillants = examAssignments.map(assignment => {
      const teacher = teachers.find(t => t.id === assignment.enseignantId);
      return {
        nom: teacher?.nom || 'Inconnu',
        prenom: teacher?.prenom || '',
      };
    });

    return {
      ...exam,
      surveillants
    };
  });

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-[9999]">
      <div className="fixed inset-0 bg-black bg-opacity-50" 
           onClick={() => dispatch(selectPeriod(null))} />
      
      <div className="relative bg-white rounded-lg w-full max-w-4xl z-[10000]">
        <div className="flex justify-between items-start p-4 border-b">
          <div className="flex items-start gap-4">
          <img src={logoensaj} alt="ENSAJ" className="h-16" />
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
          {isLoading ? (
            <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2 text-left">Module</th>
                  <th className="border px-4 py-2">Local</th>
                  <th className="border px-4 py-2">Surveillance</th>
                </tr>
              </thead>
              <tbody>
                {examensWithSurveillants.map((exam, idx) => (
                  <tr key={idx}>
                    <td className="border px-4 py-2">
                      <div>Module: {exam.module}</div>
                      <div>Option: {exam.optionName}</div>
                    </td>
                    <td className="border px-4 py-2 text-center">
                      {exam.locaux?.map(localId => {
                        const local = locaux.find(l => l.id === localId);
                        return (
                          <div key={localId}>
                            {local?.nom }
                          </div>
                        );
                      })}
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex flex-col items-center">
                        {exam.surveillants?.map((surveillant, sIdx) => (
                          <div key={sIdx} className="relative">
                            {surveillant.nom} {surveillant.prenom}
                            {surveillant.type && (
                              <span className="text-xs text-gray-500 ml-1">
                                ({surveillant.type})
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
                {examensWithSurveillants.length === 0 && (
                  <tr>
                    <td colSpan="3" className="border px-4 py-2 text-center text-gray-500">
                      Aucun examen pour cette période
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};