import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction, useState } from 'react';
import { useTelegram } from '../../../../hooks/useTelegram';
import { createProject, CreateProjectConfig } from '../../requests/project/project-requests';
import { login, LoginConfig } from '../../requests/auth/login';


export const useCreateProject = (setCreateLoading: Dispatch<SetStateAction<boolean>>) => {
  const navigate = useNavigate();
  const { webApp } = useTelegram();
  const [savedVariables, setSavedVariables] = useState<CreateProjectConfig | null>(null);

  return useMutation({
    mutationFn: (config: CreateProjectConfig) => createProject(config),
    onSuccess: () => {
      setCreateLoading(false);
      navigate('/projects');
    },
    onMutate: (variables) => {
      setSavedVariables(variables);
    },
    onError: async (error: any) => {
      setCreateLoading(false);

      if (error?.response?.status === 401 && webApp) {
        const loginConfig: LoginConfig = {
          params: { initData: { initData: webApp.initData } }
        };

        try {
          const response = await login(loginConfig);
          const newToken = response.data.token;
          localStorage.setItem('token', newToken);

          if (savedVariables) {
            await createProject(savedVariables);
            navigate('/projects');
          }
        } catch (loginError) {
          console.error('Login failed:', loginError);
        }
      }
    },
  });
};