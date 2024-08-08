import { useQuery } from '@tanstack/react-query';
import { getMyProjects } from '../../requests/project/project-requests';

export const useGetMyProjects = (userId?: string) => {
  const query = useQuery({
    queryKey: ['getMyProjects', userId],
    queryFn: () => {
      if (userId) {
        return getMyProjects({ params: userId });
      }
      return Promise.reject('userId invalid');
    },
    select: (data) => data,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });

  return { ...query };
};
