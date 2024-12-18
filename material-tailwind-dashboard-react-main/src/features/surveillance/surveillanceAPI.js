import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const surveillanceApi = createApi({
  reducerPath: 'surveillanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8888/SERVICE-EXAMEN/api/surveillance',
    credentials: 'include'
  }),
  tagTypes: ['Surveillance'],
  endpoints: (builder) => ({
    getEmploiSurveillance: builder.query({
      query: ({ sessionId, departementId }) => 
        `/emploi?sessionId=${sessionId}&departementId=${departementId}`,
      providesTags: ['Surveillance']
    }),
    getExamens: builder.query({
      query: ({ date, horaire, sessionId }) => 
        `/examens?date=${date}&horaire=${horaire}&sessionId=${sessionId}`,
      providesTags: ['Surveillance']
    }),
    getEnseignantsDisponibles: builder.query({
      query: ({ departementId, date, periode }) => 
        `/enseignants-disponibles?departementId=${departementId}&date=${date}&periode=${periode}`,
      providesTags: ['Surveillance']
    }),
    getLocauxDisponibles: builder.query({
      query: ({ date, horaire }) => 
        `/locaux-disponibles?date=${date}&horaire=${horaire}`,
      providesTags: ['Surveillance']
    }),
    assignSurveillant: builder.mutation({
      query: (data) => ({
        url: '/assign',
        method: 'POST',
        body: {
          examenId: data.examenId,
          enseignantId: data.enseignantId,
          localId: data.localId,
          typeSurveillant: data.typeSurveillant
        }
      }),
      invalidatesTags: ['Surveillance']
    })
  })
});

export const {
  useGetEmploiSurveillanceQuery,
  useGetExamensQuery,
  useGetEnseignantsDisponiblesQuery,
  useGetLocauxDisponiblesQuery,
  useAssignSurveillantMutation
} = surveillanceApi;