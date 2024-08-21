import { useQuery } from '@tanstack/react-query';
import { GetTotalSpendingsParams } from 'api';
import { getTotalSpendings } from '../../requests/project/project-requests';
import { AxiosError } from 'axios';
import { useTelegram } from '../../../../hooks/useTelegram';
import { login, LoginConfig } from '../../requests/auth/login';
import { showErrorMessage } from '../../../helpers/notify';
import toast from 'react-hot-toast';

export const useGetTotalSpending = (projectId?: string) => {
  const { webApp } = useTelegram();

  const query = useQuery({
    queryKey: ['totalSpending', projectId],
    queryFn: async () => {
      if (!projectId) {
        showErrorMessage('Project ID is invalid');
        return Promise.reject('Invalid project id');
      }

      try {
        return await getTotalSpendings({ params: { projectId: projectId } });
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 401) {
          if (webApp) {
            const loginConfig: LoginConfig = {
              params: { initData: { initData: webApp.initData } },
            };
            try {
              const response = await toast.promise(
                login(loginConfig),
                {
                  success: 'Logged in successfully',
                  error: 'Failed to sign in',
                  loading: 'Logging in',
                },
                {
                  style: {
                    borderRadius: '10px',
                    background: '#333',
                    color: '#fff',
                  },
                }
              );
              const newToken = response.data.token;
              localStorage.setItem('token', newToken);
              return await getTotalSpendings({ params: { projectId: projectId } });
            } catch (loginError) {
              showErrorMessage('Login failed');
            }
          }
          showErrorMessage('Cannot get total spendings due to authorization issues');
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
