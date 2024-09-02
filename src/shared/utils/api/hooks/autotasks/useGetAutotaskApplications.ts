import { GetAutotaskApplicationsParams } from 'api';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { getAutotaskApplications } from '../../requests/autotasks/getAutotaskApplications';

export const useGetAutotaskApplications = (params: GetAutotaskApplicationsParams) => {
  const { webApp } = useTelegram();

  const query = useQuery({
    queryKey: ['getUserAutotaskApplications', params.userId],
    queryFn: async () => {
      if (!params.userId) {
        return Promise.reject('userId invalid');
      }

      try {
        return await getAutotaskApplications({ params: params });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && webApp) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: webApp.initData } },
          };

          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            return await getAutotaskApplications({ params: params });
          } catch (loginError) {
            return Promise.reject('Login failed');
          }
        }
        return Promise.reject('Something went wrong');
      }
    },
    select: (data) => data,
    retry: false,
    refetchOnWindowFocus: 'always',
    refetchInterval: 130000,
  });

  return { ...query };
};
