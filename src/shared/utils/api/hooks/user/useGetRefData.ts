import { useQuery } from '@tanstack/react-query';
import { getRefData } from '../../requests/user/getRefData';

export const useGetRefData = (userId?: string) => {
  const query = useQuery({
    queryKey: ['getRefData', userId],
    queryFn: async () => {
      if (!userId) {
        throw new Error('userId is invalid');
      }

      try {
        return await getRefData({ params: { telegramId: userId } });
      } catch (error) {
        throw new Error('Smth went wrong');
      }
    },
    select: (data) => data.data,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
  });

  return { ...query };
};
