import { configureStore } from '@reduxjs/toolkit';
import { sessionApi } from '../features/session/sessionApi';
import { examApi } from '../features/exam/examSlice';
import examReducer from '../features/exam/examSlice';


import surveillanceReducer from '../features/surveillance/surveillanceSlice';
import { departmentApi } from '../features/department/departmentSlice';
import { teacherApi } from '../features/teacher/teacherSlice';
import { localApi } from '../features/local/localSlice';
import { optionApi } from '../features/options/optionSlice';
import { moduleApi } from '../features/modules/moduleSlice';
import {surveillanceApi} from '../features/surveillance/surveillanceAPI';



export const store = configureStore({
  reducer: {

    exams: examReducer,
    surveillance: surveillanceReducer,
    [departmentApi.reducerPath]: departmentApi.reducer,
    [sessionApi.reducerPath]: sessionApi.reducer,
    [examApi.reducerPath]: examApi.reducer,
    [teacherApi.reducerPath]: teacherApi.reducer,
    [localApi.reducerPath]: localApi.reducer,
    [optionApi.reducerPath]: optionApi.reducer,
    [moduleApi.reducerPath]: moduleApi.reducer,
    [surveillanceApi.reducerPath]: surveillanceApi.reducer



  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      sessionApi.middleware,
      examApi.middleware,
      departmentApi.middleware,
      teacherApi.middleware,
      localApi.middleware,
      optionApi.middleware,
      moduleApi.middleware,
      surveillanceApi.middleware,

 
    ),
});