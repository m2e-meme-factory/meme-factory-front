import { useQuery } from '@tanstack/react-query';
import { getProject } from '../../requests/project/project-requests';

export const useGetProject = (projectId: string) => {
  const query = useQuery({
    queryKey: ['getProject', projectId],
    queryFn: () => {
      return getProject({ params: projectId });
    },
    select: (data) => data,
  });

  return { ...query};
};