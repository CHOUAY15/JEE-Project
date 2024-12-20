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
      providesTags: ['Option'],
      pollingInterval: 1, // Rafraîchissement toutes les 30 secondes (30000 ms)
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
    }),
    importOptions: builder.mutation({
      query: (formData) => {
        return {
          url: '/import',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['Option'],
    }),
  })
});

export const {
  useGetOptionsQuery,
  useCreateOptionMutation,
  useUpdateOptionMutation,
  useDeleteOptionMutation,
  useImportOptionsMutation
} = optionApi;