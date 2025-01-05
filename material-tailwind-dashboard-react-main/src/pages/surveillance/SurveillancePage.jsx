import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SurveillanceTable } from '../../components/surveillance/SurveillanceTable';
import { 
  useAssignSurveillantMutation,
  useGetExamensResQuery 
} from '../../features/surveillance/surveillanceAPI';
import { useGetDepartmentTeachersQuery } from '../../features/teacher/teacherSlice';
import { useGetDepartmentsQuery } from '../../features/department/departmentSlice';
import { setSurveillance } from '../../features/surveillance/surveillanceSlice';

const SurveillancePage = () => {
  const dispatch = useDispatch();
  const [isGenerating, setIsGenerating] = useState(false);
  const selectedSession = useSelector((state) => state.exams.selectedSession);
  const selectedDepartment = useSelector((state) => state.surveillance.selectedDepartment);
  const surveillances = useSelector((state) => state.surveillance.surveillances);
  const [assignSurveillant] = useAssignSurveillantMutation();

  const { data: departments = [] } = useGetDepartmentsQuery();
  
  const departmentId = useMemo(() => {
    const dept = departments.find(d => d.nom === selectedDepartment);
    return dept?.id;
  }, [departments, selectedDepartment]);

  const { data: teachers = [] } = useGetDepartmentTeachersQuery(
    departmentId,
    { skip: !departmentId }
  );

  const checkTeacherAvailability = (teacherId, date, timeSlot) => {
    const key = `${teacherId}-${date}-${timeSlot}`;
    if (surveillances[key]) return false;

    const dailySurveillances = Object.values(surveillances).filter(s => 
      s.teacherId === teacherId && s.date === date
    );
    if (dailySurveillances.length >= 2) return false;

    return true;
  };

  const hasExamInTimeSlot = (date, timeSlot) => {
    return Object.values(surveillances).some(s =>
      s.date === date &&
      s.horaire === timeSlot &&
      s.typeSurveillant === 'TT'
    );
  };

  const findNextAvailableTeacher = (date, timeSlot, assignedTeachers) => {
    const teachersWithRRCount = teachers.map(teacher => {
      const rrCount = Object.values(surveillances).filter(s => 
        s.teacherId === teacher.id && s.typeSurveillant === 'RR'
      ).length;
      return { ...teacher, rrCount };
    });

    const sortedTeachers = teachersWithRRCount.sort((a, b) => {
      if (a.rrCount !== b.rrCount) return a.rrCount - b.rrCount;
      if (assignedTeachers.includes(a.id)) return 1;
      if (assignedTeachers.includes(b.id)) return -1;
      return 0;
    });

    return sortedTeachers.find(teacher => 
      !assignedTeachers.includes(teacher.id) && 
      checkTeacherAvailability(teacher.id, date, timeSlot)
    );
  };

  const generateSurveillances = async () => {
    if (!selectedSession || !teachers.length) return;

    try {
      setIsGenerating(true);

      const timeSlots = selectedSession.timeSlots ? {
        'Matin': [
          `${selectedSession.timeSlots.slot1.start}-${selectedSession.timeSlots.slot1.end}`,
          `${selectedSession.timeSlots.slot2.start}-${selectedSession.timeSlots.slot2.end}`
        ],
        'Après-midi': [
          `${selectedSession.timeSlots.slot3.start}-${selectedSession.timeSlots.slot3.end}`,
          `${selectedSession.timeSlots.slot4.start}-${selectedSession.timeSlots.slot4.end}`
        ]
      } : {
        'Matin': ['08:30-10:00', '10:30-12:00'],
        'Après-midi': ['14:30-16:00', '16:30-18:00']
      };

      const sessionStart = new Date(selectedSession.sessionDates.start);
      const sessionEnd = new Date(selectedSession.sessionDates.end);
      const dates = [];
      
      for (let d = new Date(sessionStart); d <= sessionEnd; d.setDate(d.getDate() + 1)) {
        dates.push(d.toISOString().split('T')[0]);
      }

      let recentlyAssignedTeachers = [];

      for (const date of dates) {
        for (const [period, slots] of Object.entries(timeSlots)) {
          for (const timeSlot of slots) {
            const hasExams = hasExamInTimeSlot(date, timeSlot);

            if (hasExams) {
              const hasExistingRR = Object.values(surveillances).some(s =>
                s.date === date && 
                s.horaire === timeSlot && 
                s.typeSurveillant === 'RR'
              );

              if (!hasExistingRR) {
                const nextTeacher = findNextAvailableTeacher(date, timeSlot, recentlyAssignedTeachers);
                
                if (nextTeacher) {
                  try {
                    const response = await assignSurveillant({
                      enseignantId: nextTeacher.id,
                      date,
                      horaire: timeSlot,
                      sessionId: selectedSession.sessionId,
                      typeSurveillant: 'RR'
                    }).unwrap();

                    if (response?.id) {
                      dispatch(setSurveillance({
                        teacherId: nextTeacher.id,
                        date,
                        timeSlot,
                        status: 'RR',
                        id: response.id,
                        typeSurveillant: 'RR'
                      }));

                      recentlyAssignedTeachers.push(nextTeacher.id);
                      if (recentlyAssignedTeachers.length > Math.min(3, teachers.length - 1)) {
                        recentlyAssignedTeachers.shift();
                      }
                    }
                  } catch (error) {
                    console.error('Erreur lors de l\'assignation:', error);
                  }
                }
              }
            }
          }
        }
      }

    } catch (error) {
      console.error('Erreur lors de la génération automatique:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Déclencher la génération automatique au chargement et quand les dépendances changent
  useEffect(() => {
    if (!isGenerating && selectedSession && teachers.length > 0 && departmentId) {
      generateSurveillances();
    }
  }, [selectedSession, teachers, departmentId, surveillances]);

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Surveillance des examens</h1>
        </div>
        <SurveillanceTable />
      </div>
    </div>
  );
};

export default SurveillancePage;