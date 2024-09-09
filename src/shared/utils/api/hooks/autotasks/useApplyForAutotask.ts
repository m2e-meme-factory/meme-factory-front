import { Dispatch, SetStateAction, useState } from 'react';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useMutation } from '@tanstack/react-query';
import {
  applyForAutotask,
  ApplyForAutotaskConfig,
} from '../../requests/autotasks/applyForAutotask';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { calculateTimeLeft } from '../../../helpers/calculateTimeLeft';
import { AutotaskApplicationDTO } from 'api';

export const useApplyForAutotask = (
  setApplicationInfo: Dispatch<SetStateAction<AutotaskApplicationDTO | undefined>>,
  setTimeLeft?: Dispatch<SetStateAction<number>>
) => {
  const [savedVariables, setSavedVariables] = useState<ApplyForAutotaskConfig>();
  const { webApp } = useTelegram();

  return useMutation({
    mutationFn: async (config: ApplyForAutotaskConfig) => {
      return await applyForAutotask(config);
    },
    onSuccess: (data) => {
      if (!data.data.isIntegrated) {
        if (setTimeLeft) {
          setTimeLeft(calculateTimeLeft(data.data.createdAt));
        }
      }
      showSuccessMessage('Application was sent successfully');
      setApplicationInfo(data.data);
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
            return await showToastWithPromise({
              success: 'Application was created successfully',
              error: 'Error while creating the application',
              process: 'Re-creating the application',
              callback: () => applyForAutotask(savedVariables),
            });
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
