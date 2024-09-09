import { configureStore } from '@reduxjs/toolkit';

import userReducer from './user/userSlice';
import projectReducer from './project/projectSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
