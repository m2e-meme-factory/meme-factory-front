import { useQuery } from '@tanstack/react-query';
import { authMe } from '../../requests/auth/me';
import { useTelegram } from '../../../../hooks/useTelegram';
import { showErrorMessage, showSuccessMessage } from '../../../helpers/notify';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';

export const useAuthMe = () => {
  const { webApp } = useTelegram();

  const query = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      try {
        return await authMe();
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
    select: (data) => data,
    retry: false,
    refetchOnWindowFocus: 'always',
  });

  return { ...query };
};
