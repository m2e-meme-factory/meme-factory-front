import { getProgressByProjectId } from '../../requests/project/project-requests';
import { GetProgressByProjectIdParams } from 'api';
import { AxiosError } from 'axios';
import { useQuery } from '@tanstack/react-query';
import { login, LoginConfig } from '../../requests/auth/login';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useGetProgress = (params: GetProgressByProjectIdParams) => {
  const [_initDataUnsafe, initData] = useInitData();

  const query = useQuery({
    queryKey: ['getProgress', params.projectId, params.userId],
    queryFn: async () => {
      try {
        // return await getProgressByProjectId({ params: params });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          if (initData) {
            const loginConfig: LoginConfig = {
              params: { initData: { initData: initData } },
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
