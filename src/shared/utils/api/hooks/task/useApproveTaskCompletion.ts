import {
  approveTaskCompletion,
  ApproveTaskCompletionConfig,
} from '../../requests/task/approveTaskCompletion';
import { Dispatch, SetStateAction, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

interface Response {
  statusCode: number;
  message: string;
  error: string;
}

export const useApproveTaskCompletion = (
  setTaskApproved: Dispatch<SetStateAction<boolean>>,
  setNewEventCreated?: Dispatch<SetStateAction<boolean>>
) => {
  const [savedVariables, setSavedVariables] = useState<ApproveTaskCompletionConfig | null>(null);
  const [_initDataUnsafe, initData] = useInitData();

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
      if (error?.response?.status === 401 && initData) {
        showErrorMessage('Unauthorized! Trying to login');
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
        if (error && error.response && error.response.data) {
          const data = error.response.data as Response;
          showErrorMessage(data.message);
        } else {
          showErrorMessage('An unknown error occurred');
        }
      }
    },
  });
};
