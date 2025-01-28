import { useMutation } from '@tanstack/react-query';
import { createEvent, CreateEventConfig } from '../../requests/event/createEvent';
import { Dispatch, SetStateAction, useState } from 'react';
import { AxiosError } from 'axios';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { showErrorMessage, showToastWithPromise } from '../../../helpers/notify';
import { useInitData } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';
import { LOCAL_TEXT } from '@shared/consts';

export const useCreateEvent = (setEventCreated?: Dispatch<SetStateAction<boolean>>) => {
  const { t } = useTranslation();
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
              success: t(LOCAL_TEXT.LOGGED_IN_SUCCESSFULLY),
              error: t(LOCAL_TEXT.FAILED_TO_SING_IN),
              loading: t(LOCAL_TEXT.LOGGING_IN),
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
              success: t(LOCAL_TEXT.EVENT_CREATED_SUCCESSFULLY),
              error: t(LOCAL_TEXT.ERROR_CREATED_EVENT),
              process: t(LOCAL_TEXT.RE_CREATING_EVENT),
              callback: () => createEvent(savedVariables),
            });
            if (setEventCreated) {
              setEventCreated(true);
            }
          }
        } catch (loginError) {
          showErrorMessage(t(LOCAL_TEXT.FAILED_CREATE_EVENT_AUTHORIZATION_ISSUE));
        }
      } else {
        showErrorMessage(t(LOCAL_TEXT.SOMETHIMG_WENT_WRONG));
      }
    },
  });
};
