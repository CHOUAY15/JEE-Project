// surveillanceSlice.js
import { createSlice } from '@reduxjs/toolkit';
const initialState = {
  selectedDepartment: null,
  currentStartDate: null,
  selectedPeriod: null,
  surveillances: {}
};

const surveillanceSlice = createSlice({
  name: 'surveillance',
  initialState,
  reducers: {
    setInitialDate: (state, action) => {
      if (action.payload) {
        state.currentStartDate = action.payload;
      }
    },
    navigateDates: (state, action) => {
      const currentDate = new Date(state.currentStartDate);
      const direction = action.payload;
      const newDate = new Date(currentDate);
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 1 : -1));
      state.currentStartDate = newDate.toISOString().split('T')[0];
    },
    changeDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    selectPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    setSurveillancesFromAssignments: (state, action) => {
      const assignments = action.payload || [];
      const newSurveillances = {};
    
      if (Array.isArray(assignments)) {
        assignments.forEach(assignment => {
          if (assignment && assignment.enseignantId) {
            const key = `${assignment.enseignantId}-${assignment.date}-${assignment.horaire}`;
            newSurveillances[key] = {
              id: assignment.id,
              status: assignment.typeSurveillant,
              localId: assignment.localId,
              examenId: assignment.examenId,
              typeSurveillant: assignment.typeSurveillant,
              date: assignment.date,
              horaire: assignment.horaire
            };
          }
        });
      }
    
      state.surveillances = newSurveillances;
    },
    setSurveillance: (state, action) => {
      const { teacherId, date, timeSlot, status, id, localId, examenId, typeSurveillant } = action.payload;
      const key = `${teacherId}-${date}-${timeSlot}`;
      
      if (status === '') {
        delete state.surveillances[key];
      } else {
        state.surveillances[key] = {
          id,
          status,
          localId,
          examenId,
          typeSurveillant,
          date,
          horaire: timeSlot
        };
      }
    },
    resetSurveillance: (state) => {
      state.surveillances = {};
      state.selectedPeriod = null;
    }
  }
});

export const {
  setInitialDate,
  navigateDates,
  changeDepartment,
  selectPeriod,
  setSurveillance,
  setSurveillancesFromAssignments,
  resetSurveillance
} = surveillanceSlice.actions;

export default surveillanceSlice.reducer;