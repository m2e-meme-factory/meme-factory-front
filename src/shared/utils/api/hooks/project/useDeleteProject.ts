import { useMutation } from '@tanstack/react-query';
import { deleteProject, GetOrDeleteProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';

export const useDeleteProject = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (config: GetOrDeleteProjectConfig) => deleteProject(config),
    onSuccess: () => {
      navigate('/projects');
    }
  });
}