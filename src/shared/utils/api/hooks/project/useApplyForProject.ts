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

export const useApplyForProject = (
  setApplyLoading: Dispatch<SetStateAction<boolean>>,
  setButtonDisabled: Dispatch<SetStateAction<boolean>>,
  setRole: Dispatch<SetStateAction<UserRoleInProject>>
) => {
  const [_initDataUnsafe, initData] = useInitData();
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
