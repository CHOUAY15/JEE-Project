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
    })
  })
});

export const {
  useGetDepartmentTeachersQuery,
  useCreateTeacherMutation,
  useUpdateTeacherMutation,
  useDeleteTeacherMutation
} = teacherApi;