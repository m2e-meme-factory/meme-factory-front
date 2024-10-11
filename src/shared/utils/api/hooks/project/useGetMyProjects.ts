import { useQuery } from '@tanstack/react-query';
import { getMyProjects } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { GetMyProjectsParams } from 'api';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useGetMyProjects = (params: GetMyProjectsParams) => {
  const [_initDataUnsafe, initData] = useInitData();
  const { userId, page, limit } = params;

  const query = useQuery({
    queryKey: ['getMyProjects', userId, page, limit],
    queryFn: async () => {
      if (!userId) {
        return Promise.reject('userId invalid');
      }

      try {
        return await getMyProjects({ params: { userId: userId, page: page, limit: limit } });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && initData) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: initData } },
          };

          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            return await getMyProjects({ params: { userId: userId, page: page, limit: limit } });
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
