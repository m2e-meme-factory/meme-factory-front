import { useQuery } from '@tanstack/react-query';
import { getRefData } from '../../requests/user/getRefData';

export const useGetRefData = (userId: string | undefined) => {
  const query = useQuery({
    queryKey: ['getRefId', userId],
    queryFn: () => {
      if (userId) {
        return getRefData({ params: { telegramId: userId } });
      }
      return Promise.reject('RefId invalid');
    },
    select: (data) => data,
  });

  return { ...query };
};
