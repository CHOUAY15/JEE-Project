import React from 'react';
import { useSelector , useDispatch} from 'react-redux';
import { ExamCalendar } from '../components/exam/ExamCalendar';
import { useEffect } from 'react';
const ExamsPage = () => {

  const dispatch = useDispatch();

  const selectedSession = useSelector((state) => state.exams.selectedSession);
  useEffect(() => {
    if (!selectedSession) {
      const sessionFromStorage = JSON.parse(localStorage.getItem('selectedSession'));
      if (sessionFromStorage) {
        dispatch(setSelectedSession(sessionFromStorage));
      }
    }
  }, [dispatch, selectedSession]);

  const sessionId = selectedSession.sessionId;
  console.log('id de session' , sessionId)

  if (!selectedSession) {
    return (
      <div className="space-y-6 p-6">
        <div className="text-red-600 bg-red-50 p-4 rounded">
          Veuillez d'abord sélectionner une session pour voir le planning des examens.
          <div className="mt-2">
            <a href="/" className="text-blue-600 hover:text-blue-800 underline">
              Retourner à la sélection des sessions
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-xl font-medium text-gray-900">
            Planning des examens - {selectedSession.sessionType}
          </h1>
          <p className="text-sm text-gray-500">
            {new Date(selectedSession.sessionDates.start).toLocaleDateString()} au{' '}
            {new Date(selectedSession.sessionDates.end).toLocaleDateString()}
          </p>
        </div>
      </div>
      <ExamCalendar sessionData={selectedSession} />
    </div>
  );
};

export default ExamsPage;