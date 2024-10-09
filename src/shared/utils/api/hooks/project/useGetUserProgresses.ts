import { GetUserProgressesParams } from 'api';
import { useQuery } from '@tanstack/react-query';
import { getUserProgresses } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useGetUserProgresses = (params: GetUserProgressesParams) => {
  const [_initDataUnsafe, initData] = useInitData();
  const { userId } = params;

  const query = useQuery({
    queryKey: ['getUserProgress', userId],
    queryFn: async () => {
      if (!userId) {
        return Promise.reject('userId invalid');
      }

      try {
        return await getUserProgresses({ params: { userId: userId } });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && initData) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: initData } },
          };

          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            return await getUserProgresses({ params: { userId: userId } });
          } catch (loginError) {
            throw new Error('Login failed');
          }
        }
        throw new Error('Something went wrong');
      }
    },
    select: (data) => data,
    staleTime: 0,
    retry: false,
  });

  return { ...query };
};
