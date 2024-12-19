import { createSlice } from '@reduxjs/toolkit';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// RTK Query API
export const departmentApi = createApi({
  reducerPath: 'departmentApi',
  baseQuery: fetchBaseQuery({ 
    baseUrl: 'http://localhost:8888/SERVICE-DEPARTEMENT/departements',
    credentials: 'include',  // Ajout de credentials
    prepareHeaders: (headers) => {
      headers.set('Content-Type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Department'],
  endpoints: (builder) => ({
    getDepartments: builder.query({
      query: () => ({
        url: '',
        method: 'GET',
      }),
      providesTags: ['Department']
    }),
    createDepartment: builder.mutation({
      query: (department) => ({
        url: '',
        method: 'POST',
        body: department,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Department']
    }),
    updateDepartment: builder.mutation({
      query: ({ id, ...department }) => ({
        url: `/${id}`,
        method: 'PUT',
        body: department,
        headers: { 'Content-Type': 'application/json' },
      }),
      invalidatesTags: ['Department']
    }),
    deleteDepartment: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department']
    }),
    getDepartmentTeachers: builder.query({
      query: (id) => ({
        url: `/${id}/enseignants`,
        method: 'GET',
      }),
      providesTags: ['Department']
    })
  })
});

// Slice pour la gestion d'état locale
const departmentSlice = createSlice({
  name: 'departments',
  initialState: {
    selectedDepartment: null,
    loading: false,
    error: null
  },
  reducers: {
    setSelectedDepartment: (state, action) => {
      state.selectedDepartment = action.payload;
    },
    clearSelectedDepartment: (state) => {
      state.selectedDepartment = null;
    },
  }
});

export const {
  setSelectedDepartment,
  clearSelectedDepartment,
} = departmentSlice.actions;

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
  useGetDepartmentTeachersQuery
} = departmentApi;

export default departmentSlice.reducer;