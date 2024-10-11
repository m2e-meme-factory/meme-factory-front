import { useQuery } from '@tanstack/react-query';
import { getPublicProjects } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { GetPublicProjectsParams } from 'api';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useGetPublicProjects = (params: GetPublicProjectsParams) => {
  const [_initDataUnsafe, initData] = useInitData();

  const query = useQuery({
    queryKey: ['getPublicProjects', params.page, params.category, params.tags],
    queryFn: async () => {
      try {
        return await getPublicProjects({ params: params });
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
    refetchOnWindowFocus: 'always',
  });

  return { ...query };
};
