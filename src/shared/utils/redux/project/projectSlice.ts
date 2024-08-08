import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { Project } from 'api';

export interface ProjectSlice {
  project?: Project;
}

const initialState: ProjectSlice = {
  project: undefined,
};

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProject: (state: ProjectSlice, action: PayloadAction<Project>) => {
      state.project = action.payload;
    },
  },
});

export const { setProject } = projectSlice.actions;
export default projectSlice.reducer;
