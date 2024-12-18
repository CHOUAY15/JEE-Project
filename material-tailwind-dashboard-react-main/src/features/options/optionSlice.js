// src/features/options/optionSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const optionApi = createApi({
  reducerPath: 'optionApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8888/SERVICE-EXAMEN/api/options',
    credentials: 'include'
  }),
  tagTypes: ['Option'],
  endpoints: (builder) => ({
    getOptions: builder.query({
      query: () => '',
      providesTags: ['Option']
    }),
    createOption: builder.mutation({
      query: (option) => ({
        url: '',
        method: 'POST',
        body: option
      }),
      invalidatesTags: ['Option']
    }),
    updateOption: builder.mutation({
      query: ({ id, ...option }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: option
      }),
      invalidatesTags: ['Option']
    }),
    deleteOption: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Option']
    })
  })
});

export const {
  useGetOptionsQuery,
  useCreateOptionMutation,
  useUpdateOptionMutation,
  useDeleteOptionMutation
} = optionApi;