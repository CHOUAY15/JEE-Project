import React from 'react';
import { ExamCell } from './ExamCell';

export const ExamCalendar = ({ sessionData }) => {
  // Convert session time slots to array format
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

  const dates = getDatesInRange(
    sessionData.sessionDates.start,
    sessionData.sessionDates.end
  );

  return (
    <div className="bg-white rounded shadow">
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
          {dates.map(date => (
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
  );
};