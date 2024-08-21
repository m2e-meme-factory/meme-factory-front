import { GetEventsByProjectIdParams } from 'api';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { getEventsByProgressId } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';

export const useGetEvents = (params: GetEventsByProjectIdParams) => {
  const { webApp } = useTelegram();
  const query = useQuery({
    queryKey: ['getProgressEvents', params.progressId],
    queryFn: async () => {
      try {
        return await getEventsByProgressId({ params: params });
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
              return await getEventsByProgressId({ params: params });
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
