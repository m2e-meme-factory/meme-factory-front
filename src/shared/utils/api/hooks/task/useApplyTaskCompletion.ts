import { Dispatch, SetStateAction, useState } from 'react';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { showErrorMessage, showToastWithPromise } from '../../../helpers/notify';
import {
  applyTaskCompletion,
  ApplyTaskCompletionConfig,
} from '../../requests/task/applyTaskCompletion';

export const useApplyTaskCompletion = (setTaskApplied?: Dispatch<SetStateAction<boolean>>) => {
  const [savedVariables, setSavedVariables] = useState<ApplyTaskCompletionConfig | null>(null);
  const { webApp } = useTelegram();

  return useMutation({
    mutationFn: (config: ApplyTaskCompletionConfig) => applyTaskCompletion(config),
    onSuccess: () => {
      if (setTaskApplied) {
        setTaskApplied(true);
      }
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
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
              success: 'Application was created successfully',
              error: 'Error while creating the application',
              process: 'Re-creating the application',
              callback: () => applyTaskCompletion(savedVariables),
            });
            if (setTaskApplied) {
              setTaskApplied(true);
            }
          }
        } catch (loginError) {
          showErrorMessage('Failed to create the application due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
