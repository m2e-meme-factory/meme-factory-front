import { useMutation } from '@tanstack/react-query';
import { deleteProject, OnlyIdProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';

export const useDeleteProject = () => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (config: OnlyIdProjectConfig) => deleteProject(config),
    onSuccess: () => {
      navigate('/projects');
    },
  });
};
