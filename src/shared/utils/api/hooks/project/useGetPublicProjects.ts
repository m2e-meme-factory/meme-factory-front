import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPublicProjects } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { useTelegram } from '../../../../hooks/useTelegram';
import { login, LoginConfig } from '../../requests/auth/login';
import { GetPublicProjectsParams } from 'api';

export const useGetPublicProjects = (params: GetPublicProjectsParams) => {
  const { webApp } = useTelegram();

  const query = useQuery({
    queryKey: ['getPublicProjects', params.page, params.category, params.tags],
    queryFn: async () => {
      try {
        return await getPublicProjects({ params: params });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          if (webApp) {
            const loginConfig: LoginConfig = {
              params: { initData: { initData: webApp.initData } },
            };
            try {
              const response = await login(loginConfig);
              const newToken = response.data.token;
              localStorage.setItem('token', newToken);

              return await getPublicProjects({ params: params });
            } catch (loginError) {
              throw new Error('Login failed');
            }
          }
          throw new Error('Authentication error');
        }
        throw new Error('Something went wrong');
      }
    },
    select: (data) => data,
    retry: false,
    refetchOnWindowFocus: true,
  });

  return { ...query };
};
