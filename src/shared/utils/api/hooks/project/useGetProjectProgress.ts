import { getProgressByProjectId } from '../../requests/project/project-requests';
import { useTelegram } from '../../../../hooks/useTelegram';
import { GetProgressByProjectIdParams } from 'api';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { login, LoginConfig } from '../../requests/auth/login';

export const useGetProgress = (params: GetProgressByProjectIdParams) => {
  const { webApp } = useTelegram();

  const query = useQuery({
    queryKey: ['getProgress', params.projectId, params.userId],
    queryFn: async () => {
      try {
        return await getProgressByProjectId({ params: params });
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

              return await getProgressByProjectId({ params: params });
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
    refetchOnWindowFocus: 'always',
    refetchInterval: 5000,
  });

  return { ...query };
};
