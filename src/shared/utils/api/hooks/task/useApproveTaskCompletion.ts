import {
  approveTaskCompletion,
  ApproveTaskCompletionConfig,
} from '../../requests/task/approveTaskCompletion';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';

export const useApproveTaskCompletion = (
  setTaskApproved: Dispatch<SetStateAction<boolean>>,
  setNewEventCreated?: Dispatch<SetStateAction<boolean>>
) => {
  const [savedVariables, setSavedVariables] = useState<ApproveTaskCompletionConfig | null>(null);
  const { webApp } = useTelegram();

  return useMutation({
    mutationFn: (config: ApproveTaskCompletionConfig) => {
      return approveTaskCompletion(config);
    },
    onSuccess: () => {
      showSuccessMessage('Task completion was successfully approved');
      if (setNewEventCreated) {
        setNewEventCreated(true);
        setTaskApproved(true);
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
              success: 'Task completion has been approved',
              error: 'Error while approving the task completion',
              process: 'Re-approving the task completion',
              callback: () => approveTaskCompletion(savedVariables),
            });
            if (setNewEventCreated) {
              setNewEventCreated(true);
              setTaskApproved(true);
            }
          }
        } catch (loginError) {
          showErrorMessage('Failed to approve the task completion due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
