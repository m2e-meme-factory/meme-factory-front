import { useQuery } from '@tanstack/react-query';
import { getUserData } from '../../requests/user/getUserData';

export const useGetUserData = (user_id?: string) => {
  const query = useQuery({
    queryKey: ['getUser', user_id],
    queryFn: () => {
      if (user_id) {
        return getUserData({ params: { user_id } });
      }
      return Promise.reject(new Error('ID пользователя не валиден!'));
    },
    select: (data) => data,
  });

  return { ...query };
};
