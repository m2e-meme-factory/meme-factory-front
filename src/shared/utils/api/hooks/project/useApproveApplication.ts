import { Dispatch, SetStateAction, useState } from 'react';
import { useTelegram } from '../../../../hooks/useTelegram';
import {
  acceptApplicationForProject,
  AcceptApplicationForProjectConfig,
} from '../../requests/project/project-requests';
import { useMutation } from '@tanstack/react-query';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';

export const useAcceptApplication = (setApproveLoading: Dispatch<SetStateAction<boolean>>) => {
  const { webApp } = useTelegram();
  const [savedVariables, setSavedVariables] = useState<AcceptApplicationForProjectConfig | null>(
    null
  );

  return useMutation({
    mutationFn: (config: AcceptApplicationForProjectConfig) => acceptApplicationForProject(config),
    onSuccess: () => {
      setApproveLoading(false);
      showSuccessMessage('Application approved successfully');
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      setApproveLoading(false);
      if (error?.response?.status === 401 && webApp) {
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
              success: 'Application approved successfully',
              error: 'Error while approving application',
              process: 'Approving an application',
              callback: () => acceptApplicationForProject(savedVariables),
            });
          }
        } catch (loginError) {
          showErrorMessage('Failed to approve application due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
