import { useQuery } from '@tanstack/react-query';
import { getMyProjects } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { useTelegram } from '../../../../hooks/useTelegram';
import { GetMyProjectsParams } from 'api';
import { Role } from '../../../../consts/userRoles';

export const useGetMyProjects = (params: GetMyProjectsParams, role?: Role) => {
  const { webApp } = useTelegram();
  const { userId, page, limit } = params;

  const query = useQuery({
    queryKey: ['getMyProjects', userId, page, limit],
    queryFn: async () => {
      if (!userId) {
        return Promise.reject('userId invalid');
      }

      try {
        //todo: choose appropriate request for user role
        return await getMyProjects({ params: { userId: userId, page: page, limit: limit } });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && webApp) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: webApp.initData } },
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
