import { Dispatch, SetStateAction, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { applyForProject, ApplyForProjectConfig } from '../../requests/project/project-requests';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';
import { UserRoleInProject } from '../../../../../pages/ProjectPage/ProjectPage';
import { useInitData } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';
import { LOCAL_TEXT } from '@shared/consts';

export const useApplyForProject = (
  setApplyLoading: Dispatch<SetStateAction<boolean>>,
  setButtonDisabled: Dispatch<SetStateAction<boolean>>,
  setRole: Dispatch<SetStateAction<UserRoleInProject>>
) => {
  const { t } = useTranslation();
  const [_initDataUnsafe, initData] = useInitData();
  const [savedVariables, setSavedVariables] = useState<ApplyForProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: ApplyForProjectConfig) => applyForProject(config),
    onSuccess: () => {
      setApplyLoading(false);
      setButtonDisabled(true);
      setRole('unconfirmedMember');
      showSuccessMessage(t(LOCAL_TEXT.APPLICATION_SUBMITTED_SUCCESSFULLY));
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      setApplyLoading(false);
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
              success: t(LOCAL_TEXT.APPLICATION_SUBMITTED_SUCCESSFULLY),
              error: t(LOCAL_TEXT.ERROR_SUBMITTING_APPLICATION),
              process: t(LOCAL_TEXT.SUBMITTING_APPLICATION),
              callback: () => applyForProject(savedVariables),
            });
          }
        } catch (loginError) {
          showErrorMessage(t(LOCAL_TEXT.FAILED_SUBMIT_APPLICATION_AUTHORIZATION_ISSUE));
        }
      } else {
        showErrorMessage(t(LOCAL_TEXT.SOMETHIMG_WENT_WRONG));
      }
    },
  });
};
