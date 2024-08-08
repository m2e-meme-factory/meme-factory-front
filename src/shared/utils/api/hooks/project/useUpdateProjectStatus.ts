import { useMutation } from '@tanstack/react-query';
import {
  updateProjectStatus,
  UpdateProjectStatusConfig,
} from '../../requests/project/project-requests';
import { ProjectStatus } from '../../../../../@types/api';
import { useNavigate } from 'react-router-dom';

export const useUpdateProjectStatus = (projectId: string, status: ProjectStatus) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (config: UpdateProjectStatusConfig) => updateProjectStatus({params : {id: projectId, payload: {status: status}}}),
    onSuccess: () => {
      navigate(`/projects/${projectId}`)
    }
  })
}