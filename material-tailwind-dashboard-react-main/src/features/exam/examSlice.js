// src/features/exam/examSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import { surveillanceApi } from '../surveillance/surveillanceAPI';

// RTK Query API
export const examApi = createApi({
  reducerPath: 'examApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8888/SERVICE-EXAMEN/api',
    credentials: 'include'
  }),
  tagTypes: ['Exam', 'Local', 'Option', 'Module'],  // Ajoutez 'Local' ici
  endpoints: (builder) => ({
    getExams: builder.query({
      query: ({ sessionId, date, horaire }) => {
        return {
          url: `/examens/${sessionId}/${date}/${horaire}`,
          validateStatus: (response, result) => {
            return response.status === 200 && Array.isArray(result);
          },
        }
      },
      transformResponse: (response) => {
        return response;
      },
      transformErrorResponse: (response) => {
        console.error('Error response:', response);
        return response;
      },
      providesTags: ['Exam']
    }),
    getOptions: builder.query({
      query: () => '/options',
      providesTags: ['Option']
    }),
    getModulesByOption: builder.query({
      query: (optionId) => `/options/${optionId}/modules`,
      providesTags: ['Module']
    }),
    getLocaux: builder.query({
      query: () => ({
        url: 'http://localhost:8888/SERVICE-DEPARTEMENT/locaux',
      }),
      providesTags: ['Local']
    }),
    createExam: builder.mutation({
      query: (exam) => ({
        url: '/examens',
        method: 'POST',
        body: exam
      }),
      invalidatesTags: (result, error, exam) => [
        'Exam',
        { type: 'ExamensSurveillance' }
      ],
      async onQueryStarted(exam, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Force le rechargement des requêtes getExamens et getExamensRes
          dispatch(surveillanceApi.util.invalidateTags(['ExamensSurveillance']));
        } catch {}
      }
    }),
    updateExam: builder.mutation({
      query: ({ id, ...exam }) => ({
        url: `/examens/${id}`,
        method: 'PUT',
        body: exam
      }),
      invalidatesTags: (result, error, { id }) => [
        'Exam',
        { type: 'ExamensSurveillance' }
      ],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(surveillanceApi.util.invalidateTags(['ExamensSurveillance']));
        } catch {}
      }
    }),
    deleteExam: builder.mutation({
      query: (id) => ({
        url: `/examens/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: (result, error, id) => [
        'Exam',
        { type: 'ExamensSurveillance' }
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(surveillanceApi.util.invalidateTags(['ExamensSurveillance']));
        } catch {}
      }
    })
  })
});

// Local state slice
const examSlice = createSlice({
  name: 'exams',
  initialState: {
    selectedSession: JSON.parse(localStorage.getItem('selectedSession')) || null,
    activeCell: null,
    error: null
  },
  reducers: {
    setSelectedSession: (state, action) => {
      state.selectedSession = action.payload;
      localStorage.setItem('selectedSession', JSON.stringify(action.payload));
    },
    clearSelectedSession: (state) => {
      state.selectedSession = null;
      localStorage.removeItem('selectedSession');
    },
    setActiveCell: (state, action) => {
      state.activeCell = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  useGetExamsQuery,
  useGetOptionsQuery,
  useGetModulesByOptionQuery,
  useGetLocauxQuery,
  useCreateExamMutation,
  useUpdateExamMutation,
  useDeleteExamMutation
} = examApi;

export const {
  setSelectedSession,
  setActiveCell,
  setError,
  clearSelectedSession
} = examSlice.actions;

export default examSlice.reducer;
