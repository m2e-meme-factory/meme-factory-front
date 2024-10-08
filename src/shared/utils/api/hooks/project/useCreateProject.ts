import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useState } from 'react';
import { createProject, CreateProjectConfig } from '../../requests/project/project-requests';
import { login, LoginConfig } from '../../requests/auth/login';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import toast from 'react-hot-toast';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useCreateProject = (setCreateLoading: Dispatch<SetStateAction<boolean>>) => {
  const navigate = useNavigate();
  const [_initDataUnsafe, initData] = useInitData();
  const [savedVariables, setSavedVariables] = useState<CreateProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: CreateProjectConfig) => createProject(config),
    onSuccess: () => {
      setCreateLoading(false);
      showSuccessMessage('Project created successfully');
      navigate('/projects');
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      setCreateLoading(false);

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
              success: 'Project created successfully',
              error: 'Error while creating project',
              process: 'Creating a project',
              callback: () => createProject(savedVariables),
            });
            navigate('/projects');
          }
        } catch (loginError) {
          showErrorMessage('Failed to create project due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
