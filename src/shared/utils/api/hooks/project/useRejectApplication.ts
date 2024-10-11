import { Dispatch, SetStateAction, useState } from 'react';
import {
  rejectApplicationForProject,
  RejectApplicationForProjectConfig,
} from '../../requests/project/project-requests';
import { useMutation } from '@tanstack/react-query';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useRejectApplication = (
  setRejectState: Dispatch<SetStateAction<boolean>>,
  inChat: boolean
) => {
  const [_initDataUnsafe, initData] = useInitData();
  const [savedVariables, setSavedVariables] = useState<RejectApplicationForProjectConfig | null>(
    null
  );

  return useMutation({
    mutationFn: (config: RejectApplicationForProjectConfig) => rejectApplicationForProject(config),
    onSuccess: () => {
      if (!inChat) {
        setRejectState(false);
        showSuccessMessage('Application rejected successfully');
        window.location.reload();
      } else {
        setRejectState(true);
      }
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      setRejectState(false);
      if (error?.response?.status === 401 && initData) {
        const loginConfig: LoginConfig = {
          params: { initData: { initData: initData } },
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
              success: 'Application rejected successfully',
              error: 'Error while rejecting application',
              process: 'Rejecting an application',
              callback: () => rejectApplicationForProject(savedVariables),
            });
          }
        } catch (loginError) {
          showErrorMessage('Failed to reject application due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
