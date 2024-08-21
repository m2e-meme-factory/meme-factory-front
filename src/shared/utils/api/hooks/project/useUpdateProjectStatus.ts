import { useMutation } from '@tanstack/react-query';
import {
  updateProjectStatus,
  UpdateProjectStatusConfig,
} from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../../../../hooks/useTelegram';
import { login, LoginConfig } from '../../requests/auth/login';
import { useState } from 'react';
import { showSuccessMessage } from '../../../helpers/notify';

export const useUpdateProjectStatus = (projectId: string) => {
  const navigate = useNavigate();
  const { webApp } = useTelegram();
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
      if (error?.response?.status === 401 && webApp) {
        const loginConfig: LoginConfig = {
          params: { initData: { initData: webApp.initData } },
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
