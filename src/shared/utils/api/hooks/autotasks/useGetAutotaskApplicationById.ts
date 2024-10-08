import { GetAutoTaskApplicationByIdParams } from 'api';
import { useQuery } from '@tanstack/react-query';
import { getAutotaskApplicationById } from '../../requests/autotasks/getAutotaskApplicationById';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useGetAutotaskApplicationById = (params: GetAutoTaskApplicationByIdParams) => {
  const [_initDataUnsafe, initData] = useInitData();

  const query = useQuery({
    queryKey: ['getAutotaskApplicationById', params.applicationId],
    queryFn: async () => {
      if (!params.applicationId) {
        return Promise.reject('Application Id is invalid');
      }

      try {
        return await getAutotaskApplicationById({ params: params });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401 && initData) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: initData } },
          };

          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            return await getAutotaskApplicationById({ params: params });
          } catch (loginError) {
            return Promise.reject('Login failed');
          }
        }
        return Promise.reject('Something went wrong');
      }
    },
    select: (data) => data,
    retry: false,
  });

  return { ...query };
};
