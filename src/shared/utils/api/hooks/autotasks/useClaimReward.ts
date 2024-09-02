import { useState } from 'react';
import { useTelegram } from '../../../../hooks/useTelegram';
import { claimReward, ClaimRewardConfig } from '../../requests/autotasks/claimReward';
import { useMutation } from '@tanstack/react-query';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';

export const useClaimReward = () => {
  const [savedVariables, setSavedVariables] = useState<ClaimRewardConfig>();
  const { webApp } = useTelegram();

  return useMutation({
    mutationFn: (config: ClaimRewardConfig) => claimReward(config),
    onSuccess: () => {
      showSuccessMessage('Reward was claimed!');
    },
    onError: async (error: AxiosError) => {
      if (error?.response?.status === 401 && webApp) {
        showErrorMessage('Unauthorized! Trying to login');
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

          if (savedVariables) {
            await showToastWithPromise({
              success: 'Reward was claimed successfully',
              error: 'Error while claiming the reward',
              process: 'Trying to claim the reward',
              callback: () => claimReward(savedVariables),
            });
          }
        } catch (loginError) {
          showErrorMessage('Failed to create the application due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
  });
};
