// src/features/modules/moduleSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const moduleApi = createApi({
  reducerPath: 'moduleApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8888/SERVICE-EXAMEN/api/modules',
    credentials: 'include'
  }),
  tagTypes: ['Module'],
  endpoints: (builder) => ({
    getModules: builder.query({
      query: () => '',
      providesTags: ['Module']
    }),
    getModulesByOption: builder.query({
      query: (optionId) => `/option/${optionId}`,
      providesTags: ['Module']
    }),
    createModule: builder.mutation({
      query: (module) => ({
        url: '',
        method: 'POST',
        body: module
      }),
      invalidatesTags: ['Module']
    }),
    updateModule: builder.mutation({
      query: ({ id, ...module }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: module
      }),
      invalidatesTags: ['Module']
    }),
    deleteModule: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Module']
    })
  })
});

export const {
  useGetModulesQuery,
  useGetModulesByOptionQuery,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useDeleteModuleMutation
} = moduleApi;