import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { 
  selectPeriod, 
  navigateDates, 
  changeDepartment,
  setInitialDate 
} from '../../features/surveillance/surveillanceSlice';
import { useGetDepartmentsQuery } from '../../features/department/departmentSlice';
import { useGetDepartmentTeachersQuery } from '../../features/teacher/teacherSlice';
import { SurveillanceCell } from './SurveillanceCell';
import { SurveillanceModal } from './SurveillanceModal';

export const SurveillanceTable = () => {
  const dispatch = useDispatch();
  const selectedSession = useSelector((state) => state.exams.selectedSession);
  const { 
    selectedDepartment,
    currentStartDate,
    surveillances
  } = useSelector(state => state.surveillance);

  const [selectedCell, setSelectedCell] = useState(null);

  const { data: departments = [], isLoading: isLoadingDepartments } = useGetDepartmentsQuery();

  // Récupérer les enseignants du département sélectionné


  useEffect(() => {
    // Initialiser la date au chargement si une session est sélectionnée
    if (selectedSession?.sessionDates?.start && !currentStartDate) {
      dispatch(setInitialDate(selectedSession.sessionDates.start));
    }
  }, [selectedSession, currentStartDate, dispatch]);

  const formatDateForDisplay = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  };

  useEffect(() => {
    // Si aucun département n'est sélectionné et qu'il y a des départements disponibles
    if (!selectedDepartment && departments.length > 0) {
      dispatch(changeDepartment(departments[0].nom));
    }
  }, [departments, selectedDepartment, dispatch]);

  const timeSlots = selectedSession ? {
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

  const getCurrentDepartmentId = () => {
    const dept = departments.find(d => d.nom === selectedDepartment);
    console.log("Current department:", { selectedDepartment, dept, departments });
    return dept?.id;
  };
  
  // Utiliser le hook avec l'ID correct
  const departmentId = getCurrentDepartmentId();
  const { data: teachers = [], isLoading: isLoadingTeachers } = useGetDepartmentTeachersQuery(
    departmentId,
    { skip: !departmentId }
  );
  
  // Ajouter des logs pour déboguer
  console.log("Query state:", { 
    departmentId, 
    teachers, 
    isLoadingTeachers 
  });

  const getDates = () => {
    if (!selectedSession || !currentStartDate) {
      console.log("Missing data:", { selectedSession, currentStartDate });
      return [];
    }

    const dates = [];
    const startDate = new Date(currentStartDate);
    const sessionStart = new Date(selectedSession.sessionDates.start);
    const sessionEnd = new Date(selectedSession.sessionDates.end);

    for (let i = 0; i < 3; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      // Vérifier que la date est dans les limites de la session
      if (date >= sessionStart && date <= sessionEnd) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    console.log("Generated dates:", dates);
    return dates;
  };
  useEffect(() => {
    console.log("Department or teachers changed:", {
      selectedDepartment,
      departmentId: getCurrentDepartmentId(),
      teachersCount: teachers.length
    });
  }, [selectedDepartment, teachers]);

  const dates = getDates();

  const navigateDatesHandler = (direction) => {
    if (!selectedSession) return;
    
    const firstDate = new Date(dates[0]);
    const lastDate = new Date(dates[dates.length - 1]);
    const sessionStart = new Date(selectedSession.sessionDates.start);
    const sessionEnd = new Date(selectedSession.sessionDates.end);
  
    if (direction === 'prev') {
      const newDate = new Date(firstDate);
      newDate.setDate(firstDate.getDate() - 1);
      if (newDate >= sessionStart) {
        dispatch(navigateDates('prev'));
      }
    } else if (direction === 'next') {
      const newDate = new Date(lastDate);
      newDate.setDate(lastDate.getDate() + 1);
      if (newDate <= sessionEnd) {
        dispatch(navigateDates('next'));
      }
    }
  };

  const handlePeriodClick = (date, period) => {
    dispatch(selectPeriod({ date, period }));
  };

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new();
    
    // ... (rest of exportToExcel logic remains the same)
  };

  const exportToPDF = () => {
    const doc = new jsPDF('landscape');
    
    // ... (rest of exportToPDF logic remains the same)
  };

  if (!selectedSession) {
    return (
      <div className="text-center text-gray-500 p-4">
        Veuillez sélectionner une session d'examen
      </div>
    );
  }

  console.log("Rendering with:", { 
    selectedSession, 
    currentStartDate, 
    dates,
    timeSlots 
  });

  if (isLoadingDepartments || isLoadingTeachers) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!selectedSession) {
    return (
      <div className="text-center text-gray-500 p-4">
        Veuillez sélectionner une session d'examen
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg">Surveillances par départements</h2>
          <p className="text-sm text-gray-600">
            Session {selectedSession.sessionType} du{' '}
            {formatDateForDisplay(selectedSession.sessionDates.start)} au{' '}
            {formatDateForDisplay(selectedSession.sessionDates.end)}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={exportToExcel}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            Exporter Excel
          </button>
          <button
            onClick={exportToPDF}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
          >
            Exporter PDF
          </button>
       <select
  value={selectedDepartment}
  onChange={(e) => {
    console.log("Changing department to:", e.target.value);
    dispatch(changeDepartment(e.target.value));
  }}
  className="border rounded px-3 py-1"
>
  {departments.map(dept => (
    <option key={dept.id} value={dept.nom}>
      {dept.nom}
    </option>
  ))}
</select>
        </div>
      </div>

      <div className="relative overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th rowSpan="3" className="border px-4 py-2 text-left bg-gray-50">
                Enseignants
              </th>
              {dates.map((date, index) => (
                <th key={date} colSpan="4" className="border px-4 py-2 text-center relative">
                  {formatDateForDisplay(date)}
                  {index === 0 && (
                    <button
                      onClick={() => navigateDatesHandler('prev')}
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 p-1 rounded"
                    >
                      ←
                    </button>
                  )}
                  {index === dates.length - 1 && (
                    <button
                      onClick={() => navigateDatesHandler('next')}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:bg-gray-100 p-1 rounded"
                    >
                      →
                    </button>
                  )}
                </th>
              ))}
            </tr>
            <tr>
              {dates.map(date => (
                <React.Fragment key={date}>
                  <th
                    colSpan="2"
                    className="border px-4 py-2 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => handlePeriodClick(date, 'Matin')}
                  >
                    Matin
                  </th>
                  <th
                    colSpan="2"
                    className="border px-4 py-2 text-center cursor-pointer hover:bg-gray-50"
                    onClick={() => handlePeriodClick(date, 'Après-midi')}
                  >
                    Après-midi
                  </th>
                </React.Fragment>
              ))}
            </tr>
            <tr>
              {dates.map(date => (
                <React.Fragment key={date}>
                  {Object.entries(timeSlots).flatMap(([period, slots]) =>
                    slots.map(slot => (
                      <th key={`${date}-${slot}`} className="border px-2 py-1 text-sm">
                        {slot}
                      </th>
                    ))
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {teachers.map((teacher) => (
              <tr key={teacher.id}>
                <td className="border px-4 py-2">
                  <div className="text-sm">{teacher.nom}</div>
                  {teacher.prenom && (
                    <div className="text-sm">{teacher.prenom}</div>
                  )}
                </td>
                {dates.map(date => (
                  <React.Fragment key={date}>
                    {Object.entries(timeSlots).flatMap(([period, slots]) =>
                      slots.map(slot => {
                        const cellKey = `${teacher.id}-${date}-${slot}`;
                        return (
                          <SurveillanceCell
                            key={cellKey}
                            teacher={teacher}
                            date={date}
                            timeSlot={slot}
                            currentStatus={surveillances[cellKey] || ''}
                            selectedCell={selectedCell} 
                            setSelectedCell={setSelectedCell} 
                          />
                        );
                      })
                    )}
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SurveillanceModal />
    </div>
  );
};