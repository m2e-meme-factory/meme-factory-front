import { useQuery } from '@tanstack/react-query';
import { authMe } from '../../requests/auth/me';

import { showErrorMessage } from '../../../helpers/notify';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useAuthMe = () => {
  const [_initDataUnsafe, initData] = useInitData();

  const query = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        return await authMe();
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

              return await authMe();
            } catch (loginError) {
              showErrorMessage('Authentication failed');
            }
          }
          showErrorMessage('Authentication error');
        }
        showErrorMessage('Something went wrong');
      }
    },
    select: (data) => (data ? data.data : null),
    retry: false,
    refetchOnWindowFocus: 'always',
  });

  return { ...query };
};
