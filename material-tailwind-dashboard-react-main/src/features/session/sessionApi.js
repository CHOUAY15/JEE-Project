import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const sessionApi = createApi({
    reducerPath: 'sessionApi',
    baseQuery: fetchBaseQuery({ 
        baseUrl: 'http://localhost:8888/SERVICE-EXAMEN/sessions',
        credentials: 'include',
    }),
    tagTypes: ['Session'],
    endpoints: (builder) => ({
        getSessions: builder.query({
            query: () => '',
            providesTags: ['Session'],
        }),
        createSession: builder.mutation({
            query: (session) => ({
                url: '',
                method: 'POST',
                body: session,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Session'],
        }),
        updateSession: builder.mutation({
            query: ({ id, ...session }) => ({
                url: `/${id}`,
                method: 'PUT',
                body: session,
                headers: { 'Content-Type': 'application/json' },
            }),
            invalidatesTags: ['Session'],
        }),
        deleteSession: builder.mutation({
            query: (id) => ({
                url: `/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Session'],
        }),
    }),
});

export const { 
    useGetSessionsQuery, 
    useCreateSessionMutation, 
    useUpdateSessionMutation,
    useDeleteSessionMutation 
} = sessionApi;