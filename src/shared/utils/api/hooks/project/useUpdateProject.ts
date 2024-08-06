import { useMutation } from '@tanstack/react-query';
import { updateProject, UpdateProjectConfig } from '../../requests/project/project-requests';

export const useUpdateProject = () => {
  useMutation({
    mutationFn: (config: UpdateProjectConfig) => updateProject(config),
  });
};