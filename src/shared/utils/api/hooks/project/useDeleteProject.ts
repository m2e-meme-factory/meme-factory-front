import { useMutation } from '@tanstack/react-query';
import { deleteProject, OnlyIdProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { login, LoginConfig } from '../../requests/auth/login';
import { useState } from 'react';
import { useInitData } from '@vkruglikov/react-telegram-web-app';

export const useDeleteProject = () => {
  const navigate = useNavigate();
  const [_initDataUnsafe, initData] = useInitData();
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
      if (error?.response?.status === 401 && initData) {
        const loginConfig: LoginConfig = {
          params: { initData: { initData: initData } },
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
