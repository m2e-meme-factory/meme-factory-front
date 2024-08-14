import { Dispatch, SetStateAction, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useMutation } from '@tanstack/react-query';
import {
  applyForProject,
  ApplyForProjectConfig,
  createProject,
} from '../../requests/project/project-requests';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import { ROUTES } from '../../../../consts/routes';
import { login, LoginConfig } from '../../requests/auth/login';
import toast from 'react-hot-toast';

export const useApplyForProject = (setApplyLoading: Dispatch<SetStateAction<boolean>>) => {
  const navigate = useNavigate();
  const { webApp } = useTelegram();
  const [savedVariables, setSavedVariables] = useState<ApplyForProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: ApplyForProjectConfig) => applyForProject(config),
    onSuccess: () => {
      setApplyLoading(false);
      showSuccessMessage('Application submitted successfully');
      navigate(ROUTES.MY_PROJECTS);
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
            navigate(ROUTES.MY_PROJECTS);
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
