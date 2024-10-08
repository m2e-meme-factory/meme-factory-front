import { Dispatch, SetStateAction, useState } from 'react';
import {
  rejectTaskCompletion,
  RejectTaskCompletionConfig,
} from '../../requests/task/rejectTaskCompletion';
import { useMutation } from '@tanstack/react-query';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useRejectTaskCompletion = (
  setTaskRejected: Dispatch<SetStateAction<boolean>>,
  setNewEventCreated?: Dispatch<SetStateAction<boolean>>
) => {
  const [savedVariables, setSavedVariables] = useState<RejectTaskCompletionConfig | null>(null);
  const [_initDataUnsafe, initData] = useInitData();

  return useMutation({
    mutationFn: (config: RejectTaskCompletionConfig) => {
      return rejectTaskCompletion(config);
    },
    onSuccess: () => {
      showSuccessMessage('Task completion was successfully rejected');
      if (setNewEventCreated) {
        setNewEventCreated(true);
        setTaskRejected(true);
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
              success: 'Task completion has been rejected',
              error: 'Error while rejecting the task completion',
              process: 'Re-rejecting the task completion',
              callback: () => rejectTaskCompletion(savedVariables),
            });
            if (setNewEventCreated) {
              setNewEventCreated(true);
              setTaskRejected(true);
            }
          }
        } catch (loginError) {
          showErrorMessage('Failed to reject the task completion due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
