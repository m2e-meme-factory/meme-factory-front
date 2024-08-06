import { useMutation } from '@tanstack/react-query';
import { createProject, CreateProjectConfig } from '../../requests/project/project-requests';

export const useCreateProject = () =>
  useMutation({
    mutationFn: (config: CreateProjectConfig) => createProject(config),
  });