// src/redux/sessionSlice.js
import { createSlice } from '@reduxjs/toolkit';

const sessionSlice = createSlice({
    name: 'session',
    initialState: { selectedSession: null },
    reducers: {
        selectSession: (state, action) => {
            state.selectedSession = action.payload;
        },
    },
});

export const { selectSession } = sessionSlice.actions;
export default sessionSlice.reducer;
