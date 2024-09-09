import { useMutation } from '@tanstack/react-query';
import { deleteProject, OnlyIdProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { login, LoginConfig } from '../../requests/auth/login';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useState } from 'react';

export const useDeleteProject = () => {
  const navigate = useNavigate();
  const { webApp } = useTelegram();
  const [savedVariables, setSavedVariables] = useState<OnlyIdProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: OnlyIdProjectConfig) => deleteProject(config),
    onSuccess: () => {
      navigate('/projects');
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
            await deleteProject(savedVariables);
            navigate('/projects');
          }
        } catch (loginError) {
          console.error('Login failed:', loginError);
        }
      }
    },
  });
};
