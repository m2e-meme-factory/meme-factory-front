import { useMutation } from '@tanstack/react-query';
import {
  updateProjectStatus,
  UpdateProjectStatusConfig,
} from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { login, LoginConfig } from '../../requests/auth/login';
import { useState } from 'react';
import { showSuccessMessage } from '../../../helpers/notify';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useUpdateProjectStatus = (projectId: string) => {
  const navigate = useNavigate();
  const [_initDataUnsafe, initData] = useInitData();
  const [savedVariables, setSavedVariables] = useState<UpdateProjectStatusConfig | null>(null);

  return useMutation({
    mutationFn: (config: UpdateProjectStatusConfig) => updateProjectStatus(config),
    onSuccess: () => {
      showSuccessMessage('Project status updated successfully');
      navigate(`/projects/${projectId}`);
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      if (error?.response?.status === 401 && initData) {
        const loginConfig: LoginConfig = {
          params: { initData: { initData: initData } },
        };

        try {
          const response = await login(loginConfig);
          const newToken = response.data.token;
          localStorage.setItem('token', newToken);

          if (savedVariables) {
            await updateProjectStatus(savedVariables);
            navigate(`/projects/${projectId}`);
          }
        } catch (loginError) {
          console.error('Login failed:', loginError);
        }
      }
    },
  });
};
