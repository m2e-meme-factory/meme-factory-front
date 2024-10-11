import { useMutation } from '@tanstack/react-query';
import { createEvent, CreateEventConfig } from '../../requests/event/createEvent';
import { Dispatch, SetStateAction, useState } from 'react';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { showErrorMessage, showToastWithPromise } from '../../../helpers/notify';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useCreateEvent = (setEventCreated?: Dispatch<SetStateAction<boolean>>) => {
  const [savedVariables, setSavedVariables] = useState<CreateEventConfig | null>(null);
  const [_initDataUnsafe, initData] = useInitData();

  return useMutation({
    mutationFn: (config: CreateEventConfig) => createEvent(config),
    onSuccess: () => {
      if (setEventCreated) {
        setEventCreated(true);
      }
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: AxiosError) => {
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
              success: 'Event created successfully',
              error: 'Error while creating event',
              process: 'Re-creating the event',
              callback: () => createEvent(savedVariables),
            });
            if (setEventCreated) {
              setEventCreated(true);
            }
          }
        } catch (loginError) {
          showErrorMessage('Failed to create the event due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
