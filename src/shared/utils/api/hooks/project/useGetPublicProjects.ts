import { useQuery } from '@tanstack/react-query';
import { getPublicProjects } from '../../requests/project/project-requests';

export const useGetPublicProjects = () => {
  const query = useQuery({
    queryKey: ['getPublicProjects'],
    queryFn: () => {
      return getPublicProjects({});
    },
    select: (data) => data,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });

  return { ...query };
};
