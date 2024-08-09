import { useMutation } from '@tanstack/react-query';
import { updateProject, UpdateProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { login, LoginConfig } from '../../requests/auth/login';
import { useTelegram } from '../../../../hooks/useTelegram';
import { useState } from 'react';

export const useUpdateProject = (id?: string) => {
  const navigate = useNavigate();
  const { webApp } = useTelegram();
  const [savedVariables, setSavedVariables] = useState<UpdateProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: UpdateProjectConfig) => updateProject(config),
    onSuccess: () => {
      if (id) {
        navigate(`/projects/${id}`);
      }
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      if (error?.response?.status === 401 && webApp) {
        const loginConfig: LoginConfig = {
          params: { initData: { initData: webApp.initData } }
        };

        try {
          const response = await login(loginConfig);
          const newToken = response.data.token;
          localStorage.setItem('token', newToken);

          if (savedVariables) {
            await updateProject(savedVariables);
            navigate(`/projects/${id}`);
          }
        } catch (loginError) {
          console.error('Login failed:', loginError);
        }
      }
    },
  });
};
