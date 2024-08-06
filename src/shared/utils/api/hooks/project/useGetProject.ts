import { useQuery } from '@tanstack/react-query';
import { getProject } from '../../requests/project/project-requests';

export const useGetProject = (projectId?: string) => {
  const query = useQuery({
    queryKey: ['getProject', projectId],
    queryFn: () => {
      if (projectId) {
        return getProject({ params: projectId });
      }
      return Promise.reject('ProjectId invalid');
    },
    select: (data) => data,
  });

  return { ...query};
};