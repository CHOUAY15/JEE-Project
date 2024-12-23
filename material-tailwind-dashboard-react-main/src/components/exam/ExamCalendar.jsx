import React, { useState } from 'react';
import { ExamCell } from './ExamCell';
import { ChevronLeft, ChevronRight } from "lucide-react";

export const ExamCalendar = ({ sessionData }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const daysPerPage = 5;

  // Time slots from session data
  const TIME_SLOTS = [
    `${sessionData.timeSlots.slot1.start}-${sessionData.timeSlots.slot1.end}`,
    `${sessionData.timeSlots.slot2.start}-${sessionData.timeSlots.slot2.end}`,
    `${sessionData.timeSlots.slot3.start}-${sessionData.timeSlots.slot3.end}`,
    `${sessionData.timeSlots.slot4.start}-${sessionData.timeSlots.slot4.end}`
  ];

  // Generate array of dates between start and end
  const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    const currentDate = new Date(startDate);
    const end = new Date(endDate);
    
    while (currentDate <= end) {
      dates.push(new Date(currentDate).toISOString().split('T')[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const allDates = getDatesInRange(
    sessionData.sessionDates.start,
    sessionData.sessionDates.end
  );

  const totalPages = Math.ceil(allDates.length / daysPerPage);
  const paginatedDates = allDates.slice(
    currentPage * daysPerPage,
    (currentPage + 1) * daysPerPage
  );

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Page {currentPage + 1} sur {totalPages}
        </div>
        <div className="flex space-x-2">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 0}
            className={`p-2 rounded ${
              currentPage === 0 
                ? 'text-gray-400 cursor-not-allowed' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages - 1}
            className={`p-2 rounded ${
              currentPage === totalPages - 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left font-medium text-gray-900 border-b border-r">
                Jours
              </th>
              {TIME_SLOTS.map(slot => (
                <th 
                  key={slot} 
                  className="py-3 px-4 text-center font-medium text-gray-900 border-b"
                >
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedDates.map(date => (
              <tr key={date}>
                <td className="py-2 px-4 border-r font-medium text-gray-900">
                  {new Date(date).toLocaleDateString('fr-FR', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </td>
                {TIME_SLOTS.map(slot => (
                  <td key={`${date}-${slot}`} className="border p-0 min-h-[100px]">
                    <ExamCell 
                      date={date} 
                      timeSlot={slot} 
                      sessionId={sessionData.sessionId}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};