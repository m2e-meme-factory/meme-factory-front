import { useQuery } from '@tanstack/react-query';
import { getProject } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useGetProject = (projectId?: string) => {
  const [_initDataUnsafe, initData] = useInitData();

  const query = useQuery({
    queryKey: ['getProject', projectId],
    queryFn: async () => {
      if (!projectId) {
        return Promise.reject('ProjectId invalid');
      }

      try {
        return await getProject({ params: projectId });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && initData) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: initData } },
          };

          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            return await getProject({ params: projectId });
          } catch (loginError) {
            throw new Error('Login failed');
          }
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
