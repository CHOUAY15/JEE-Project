// src/features/local/localSlice.js
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const localApi = createApi({
  reducerPath: 'localApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8888/SERVICE-DEPARTEMENT',
    credentials: 'include'
  }),
  tagTypes: ['Local'],
  endpoints: (builder) => ({
    getLocaux: builder.query({
      query: () => '/locaux',
      providesTags: ['Local']
    }),
    createLocal: builder.mutation({
      query: (local) => ({
        url: '/locaux',
        method: 'POST',
        body: local
      }),
      invalidatesTags: ['Local']
    }),
    updateLocal: builder.mutation({
      query: ({ id, ...local }) => ({
        url: `/locaux/${id}`,
        method: 'PUT',
        body: local
      }),
      invalidatesTags: ['Local']
    }),
    deleteLocal: builder.mutation({
      query: (id) => ({
        url: `/locaux/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Local']
    })
  })
});

export const {
  useGetLocauxQuery,
  useCreateLocalMutation,
  useUpdateLocalMutation,
  useDeleteLocalMutation
} = localApi;