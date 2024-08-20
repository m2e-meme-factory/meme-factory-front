import { GetProjectFreelancersParams } from 'api';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useQuery } from '@tanstack/react-query';
import { getProjectFreelancers } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';

export const useGetProjectFreelancers = (
  projectId: string,
  status: 'pending' | 'accepted' | 'rejected'
) => {
  const { webApp } = useTelegram();

  const query = useQuery({
    queryKey: ['getProjectFreelancers', projectId, status],
    queryFn: async () => {
      if (!projectId) {
        return Promise.reject('Invalid project id');
      }

      try {
        return await getProjectFreelancers({ params: { projectId: projectId, status: status } });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && webApp) {
          const loginConfig: LoginConfig = { params: { initData: { initData: webApp.initData } } };
          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            return await getProjectFreelancers({
              params: { projectId: projectId, status: status },
            });
          } catch (loginError) {
            throw new Error('Login failed');
          }
        }
      }
    },
    select: (data) => data,
    retry: false,
    refetchOnWindowFocus: 'always',
    refetchInterval: 15000,
  });

  return { ...query };
};
