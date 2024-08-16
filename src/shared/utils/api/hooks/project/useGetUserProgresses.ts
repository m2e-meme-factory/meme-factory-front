import { GetUserProgressesParams, ProjectProgress } from 'api';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { getUserProgresses } from '../../requests/project/project-requests';
import { AxiosError, AxiosResponse } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';

export const useGetUserProgresses = (params: GetUserProgressesParams) => {
  const { webApp } = useTelegram();
  const { userId } = params;

  const query = useQuery({
    queryKey: ['getUserProgress', userId],
    queryFn: async () => {
      console.log(userId)
      if (!userId) {
        return Promise.reject('userId invalid');
      }

      try {
        return await getUserProgresses({ params: { userId: userId } });
      } catch (error) {
        console.log(error, 'caught')
        if (error instanceof AxiosError && error.response?.status === 401 && webApp) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: webApp.initData } },
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
    select: (data: AxiosResponse<ProjectProgress[]>) => data,
    staleTime: 0,
    retry: false,
  });

  return { ...query };
};
