import { useMutation } from '@tanstack/react-query';
import { deleteProject, GetOrDeleteProjectConfig } from '../../requests/project/project-requests';

export const useDeleteProject = () =>
  useMutation({
    mutationFn: (config: GetOrDeleteProjectConfig) => deleteProject(config),
  });