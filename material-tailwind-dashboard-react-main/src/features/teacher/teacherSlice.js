// src/features/teacher/teacherSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const teacherApi = createApi({
  reducerPath: 'teacherApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8888/SERVICE-DEPARTEMENT',
    credentials: 'include'
  }),
  tagTypes: ['Teacher'],
  endpoints: (builder) => ({
    getDepartmentTeachers: builder.query({
      query: (departmentId) => `/departements/${departmentId}/enseignants`,
      providesTags: ['Teacher']
    }),
    getAllTeachers: builder.query({
      query: () => '/enseignants',  // Ajustez l'URL selon votre API
      providesTags: ['Teachers']
    }),
    createTeacher: builder.mutation({
      query: ({ departmentId, teacher }) => ({
        url: `/departements/${departmentId}/enseignants`,
        method: 'POST',
        body: teacher
      }),
      invalidatesTags: ['Teacher']
    }),
    updateTeacher: builder.mutation({
      query: ({ id, ...teacher }) => ({
        url: `/enseignants/${id}`,
        method: 'PUT',
        body: teacher
      }),
      invalidatesTags: ['Teacher']
    }),
    deleteTeacher: builder.mutation({
      query: (id) => ({
        url: `/enseignants/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Teacher']
    }),
     // Endpoint to get teacher's dispenses by teacherId
     getTeacherDispenses: builder.query({
      query: (teacherId) => `/enseignants/enseignants/${teacherId}/dispenses`,  // Adjust according to your backend API
      providesTags: ['Dispense']
    }),
    // Endpoint to delete a dispense by dispenseId
    deleteTeacherDispense: builder.mutation({
      query: ({ teacherId, dispenseId }) => ({
        url: `/enseignants/enseignants/${teacherId}/dispenses/${dispenseId}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Dispense']
    }),
    createTeacherDispense: builder.mutation({
      query: ({ teacherId, dispenseData }) => ({
        url: `/enseignants/enseignants/${teacherId}/dispenses`, // URL de l'endpoint
        method: 'POST',
        body: dispenseData,
      }),
    }),
  })
});

export const {
  useGetDepartmentTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation,
  useGetAllTeachersQuery,
  useGetTeacherDispensesQuery,  // Hook for fetching dispenses
  useDeleteTeacherDispenseMutation,
  useCreateTeacherDispenseMutation // Hook for deleting dispense
} = teacherApi;