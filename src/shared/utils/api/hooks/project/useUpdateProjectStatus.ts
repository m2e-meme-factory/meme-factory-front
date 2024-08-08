import { useMutation } from '@tanstack/react-query';
import {
  updateProjectStatus,
  UpdateProjectStatusConfig,
} from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { ProjectStatus } from 'api';

export const useUpdateProjectStatus = (projectId: string) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (config: UpdateProjectStatusConfig) => updateProjectStatus(config),
    onSuccess: () => {
      navigate(`/projects/${projectId}`);
    },
  });
};
