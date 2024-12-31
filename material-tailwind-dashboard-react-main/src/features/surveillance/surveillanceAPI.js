import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const surveillanceApi = createApi({
  reducerPath: 'surveillanceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:8888/SERVICE-EXAMEN/api/surveillance',
    credentials: 'include'
  }),
  tagTypes: ['Surveillance', 'ExamensSurveillance'],
  endpoints: (builder) => ({
    getSurveillanceAssignments: builder.query({
      query: ({ sessionId }) => `/assignments?sessionId=${sessionId}`,
      transformResponse: (response) => {
        console.log('Raw assignments response:', response);
        if (!response) return [];
        const assignments = Array.isArray(response) ? response : [response];
        console.log('Transformed assignments:', assignments);
        return assignments;
      },
      providesTags: ['Surveillance']
    }),

    getExamens: builder.query({
      query: ({ sessionId, date, horaire }) => 
        `/examens?date=${date}&horaire=${horaire}&sessionId=${sessionId}`,
      providesTags: (result, error, arg) => [
        'ExamensSurveillance',
        { type: 'ExamensSurveillance', id: `${arg.sessionId}-${arg.date}-${arg.horaire}` }
      ]    }),
    getExamensRes: builder.query({
      query: ({ sessionId, date, horaire }) => 
        `/examensresponse?date=${date}&horaire=${horaire}&sessionId=${sessionId}`,
      providesTags: (result, error, arg) => [
        'ExamensSurveillance',
        { type: 'ExamensSurveillance', id: `${arg.sessionId}-${arg.date}-${arg.horaire}` }
      ]    }),

    getEmploiSurveillance: builder.query({
      query: ({ sessionId, departementId }) => 
        `/emploi?sessionId=${sessionId}&departementId=${departementId}`,
      providesTags: ['Surveillance']
    }),

    assignSurveillant: builder.mutation({
      query: (data) => ({
        url: '/assign',
        method: 'POST',
        body: {
          enseignantId: data.enseignantId,
          date: data.date,
          horaire: data.horaire,
          sessionId: data.sessionId, // Ajout du sessionId
          typeSurveillant: data.typeSurveillant,
          ...(data.examenId && { examenId: data.examenId }),
          ...(data.localId && { localId: data.localId })
        }
      }),
      invalidatesTags: ['Surveillance']
    }),

    deleteSurveillant: builder.mutation({
      query: (id) => ({
        url: `/assign/${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Surveillance']
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
    })
  })
});

export const {
  useGetSurveillanceAssignmentsQuery,
  useGetExamensQuery,
  useGetEmploiSurveillanceQuery,
  useAssignSurveillantMutation,
  useDeleteSurveillantMutation,
  useGetEnseignantsDisponiblesQuery,
  useGetLocauxDisponiblesQuery,
  useGetExamensResQuery, // Exporting the examenRes query hook

} = surveillanceApi;