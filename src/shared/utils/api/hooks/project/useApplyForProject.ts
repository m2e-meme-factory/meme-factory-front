import { Dispatch, SetStateAction, useState } from 'react';
import { useTelegram } from '../../../../hooks/useTelegram';
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

export const useApplyForProject = (
  setApplyLoading: Dispatch<SetStateAction<boolean>>,
  setButtonDisabled: Dispatch<SetStateAction<boolean>>,
  setRole: Dispatch<SetStateAction<UserRoleInProject>>
) => {
  const { webApp } = useTelegram();
  const [savedVariables, setSavedVariables] = useState<ApplyForProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: ApplyForProjectConfig) => applyForProject(config),
    onSuccess: () => {
      setApplyLoading(false);
      setButtonDisabled(true);
      setRole('unconfirmedMember');
      showSuccessMessage('Application submitted successfully');
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      setApplyLoading(false);
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
              success: 'Application submitted successfully',
              error: 'Error while submitting application',
              process: 'Submitting an application',
              callback: () => applyForProject(savedVariables),
            });
          }
        } catch (loginError) {
          showErrorMessage('Failed to submit application due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
