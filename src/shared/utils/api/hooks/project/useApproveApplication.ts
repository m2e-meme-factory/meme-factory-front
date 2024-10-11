import { Dispatch, SetStateAction, useState } from 'react';
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
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useAcceptApplication = (
  setAcceptState: Dispatch<SetStateAction<boolean>>,
  inChat: boolean
) => {
  const [_initDataUnsafe, initData] = useInitData();
  const [savedVariables, setSavedVariables] = useState<AcceptApplicationForProjectConfig | null>(
    null
  );

  return useMutation({
    mutationFn: (config: AcceptApplicationForProjectConfig) => acceptApplicationForProject(config),
    onSuccess: () => {
      if (!inChat) {
        setAcceptState(false); //passed state is accept loading
        showSuccessMessage('Application approved successfully');
        window.location.reload();
      } else {
        setAcceptState(true); //passed state is whether the application accepted
      }
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      setAcceptState(false);
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
