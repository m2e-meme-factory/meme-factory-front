import { useQuery } from '@tanstack/react-query';
import { getMyProjects } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { useTelegram } from '../../../../hooks/useTelegram';

export const useGetMyProjects = (userId?: string) => {
  const { webApp } = useTelegram();

  const query = useQuery({
    queryKey: ['getMyProjects', userId],
    queryFn: async () => {
      if (!userId) {
        return Promise.reject('userId invalid');
      }

      try {
        return await getMyProjects({ params: userId });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && webApp) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: webApp.initData } },
          };

          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            return await getMyProjects({ params: userId });
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
