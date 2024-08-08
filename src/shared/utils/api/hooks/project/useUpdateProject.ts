import { useMutation } from '@tanstack/react-query';
import { updateProject, UpdateProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';

export const useUpdateProject = (id?: string) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (config: UpdateProjectConfig) => updateProject(config),
    onSuccess: () => {
      if (id) {
        navigate(`/projects/${id}`);
      }
    }
  });
};
