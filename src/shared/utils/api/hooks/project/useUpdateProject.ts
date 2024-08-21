import { useMutation } from '@tanstack/react-query';
import { updateProject, UpdateProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { login, LoginConfig } from '../../requests/auth/login';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useState } from 'react';
import {
  showErrorMessage,
  showSuccessMessage,
  showToastWithPromise,
} from '../../../helpers/notify';
import toast from 'react-hot-toast';

export const useUpdateProject = (id?: string) => {
  const navigate = useNavigate();
  const { webApp } = useTelegram();
  const [savedVariables, setSavedVariables] = useState<UpdateProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: UpdateProjectConfig) => updateProject(config),
    onSuccess: () => {
      if (id) {
        showSuccessMessage('Project updated successfully');
        navigate(`/projects/${id}`);
      }
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
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
              success: 'Project updated successfully',
              error: 'Error while updating project',
              process: 'Updating a project',
              callback: () => updateProject(savedVariables),
            });
            navigate(`/projects/${id}`);
          }
        } catch (loginError) {
          showErrorMessage('Failed to update project due to authorization issue!');
        }
      } else {
        showErrorMessage('Something went wrong!');
      }
    },
  });
};
