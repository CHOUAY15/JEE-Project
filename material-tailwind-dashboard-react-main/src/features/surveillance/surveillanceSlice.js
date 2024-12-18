import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedDepartment: null,
  currentStartDate: null,
  selectedPeriod: null,
  surveillances: {},
  examData: {}
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
      newDate.setDate(currentDate.getDate() + (direction === 'next' ? 3 : -3));
      
      state.currentStartDate = newDate.toISOString().split('T')[0];
    },
    changeDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    selectPeriod: (state, action) => {
      state.selectedPeriod = action.payload;
    },
    setSurveillance: (state, action) => {
      const { teacherId, date, timeSlot, status } = action.payload;
      const key = `${teacherId}-${date}-${timeSlot}`;
      
      if (status === '') {
        delete state.surveillances[key];
      } else {
        state.surveillances = {
          ...state.surveillances,
          [key]: status
        };
      }
    },
    addSurveillant: (state, action) => {
      const { date, period, local, surveillant } = action.payload;
      const periodKey = `${date}-${period}`;
      const exam = state.examData[periodKey]?.find(e => e.local === local);
      if (exam) {
        exam.surveillants.push(surveillant);
      }
    },
    removeSurveillant: (state, action) => {
      const { date, period, local, surveillant } = action.payload;
      const periodKey = `${date}-${period}`;
      const exam = state.examData[periodKey]?.find(e => e.local === local);
      if (exam) {
        exam.surveillants = exam.surveillants.filter(s => s !== surveillant);
      }
    },
    resetSurveillance: (state) => {
      state.surveillances = {};
      state.selectedPeriod = null;
    }
  }
});

export const {
  changeDepartment,
  navigateDates,
  selectPeriod,
  setSurveillance,
  addSurveillant,
  removeSurveillant,
  resetSurveillance,
  setInitialDate
} = surveillanceSlice.actions;

export default surveillanceSlice.reducer;