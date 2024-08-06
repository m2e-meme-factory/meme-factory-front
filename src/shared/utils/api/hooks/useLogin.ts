import { useQuery } from '@tanstack/react-query';
import { login } from '../requests/auth/login';

export const useLogin = (initDataString?: string) => {
  const query = useQuery({
    queryKey: ['login', initDataString],
    queryFn: () => {
     if (initDataString) {
       return login({ params: { initData: { initData: initDataString } } });
     }
     return Promise.reject('Invalid init data');
    },
    staleTime: 50 * 60 * 1000,
    select: (data) => data,
  });

  return { ...query };
};
