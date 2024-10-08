import { GetTxByUserParams } from 'api';
import { useQuery } from '@tanstack/react-query';
import { getTxByUser } from '../../requests/transactions/getTxByUser';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import { showErrorMessage } from '../../../helpers/notify';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useGetTransactionsByUser = (params: GetTxByUserParams) => {
  const [_initDataUnsafe, initData] = useInitData();

  const query = useQuery({
    queryKey: ['userTransactions', params.userId],
    queryFn: async () => {
      if (!params.userId) {
        showErrorMessage('Cannot fetch transactions: userId is invalid! Try again');
        return Promise.reject('Invalid userId');
      }
      try {
        return await getTxByUser({ params: params });
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

              return await getTxByUser({ params: params });
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
    refetchInterval: 15000,
  });

  return { ...query };
};
