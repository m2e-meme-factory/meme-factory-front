import { useMutation, UseMutationOptions, UseMutationResult } from '@tanstack/react-query';
import { createProject, CreateProjectConfig } from '../../requests/project/project-requests';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Dispatch, SetStateAction } from 'react';

export const useCreateProject = (setCreateLoading: Dispatch<SetStateAction<boolean>>) => {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: (config: CreateProjectConfig) => createProject(config),
    onSuccess: () => {
      setCreateLoading(false);
      toast.success('Project created successfully!');
      navigate('/projects');
    },
    onError: (error: Error) => {
      setCreateLoading(false);
      toast.error(`Error creating project: ${error.message}`);
    },
  });
};
