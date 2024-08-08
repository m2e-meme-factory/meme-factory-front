import api from '../../api';
import { AxiosResponse } from 'axios';
import {
  CreateProjectDTO,
  Project,
  RequestConfig,
  UpdateProjectPayload,
  UpdateStatusPayload,
} from 'api';

export type CreateProjectConfig = RequestConfig<CreateProjectDTO>;
export type GetPublicProjectsConfig = RequestConfig;
export type OnlyIdProjectConfig = RequestConfig<string>;
export type UpdateProjectConfig = RequestConfig<UpdateProjectPayload>;
export type UpdateProjectStatusConfig = RequestConfig<UpdateStatusPayload>;

export const createProject = (config: CreateProjectConfig): Promise<AxiosResponse<Project>> => {
  return api.post('/projects', config.params, config?.config);
};

export const getPublicProjects = (
  config: GetPublicProjectsConfig
): Promise<AxiosResponse<Project[]>> => {
  return api.get('/projects', config?.config);
};

export const getProject = (config: OnlyIdProjectConfig): Promise<AxiosResponse<Project>> => {
  return api.get(`/projects/${config.params}`, config?.config);
};

export const updateProject = (config: UpdateProjectConfig): Promise<AxiosResponse<Project>> => {
  return api.put(`/projects/${config.params.projectId}`, config.params.project, config?.config);
};

export const deleteProject = (config: OnlyIdProjectConfig): Promise<AxiosResponse> => {
  return api.delete(`/projects/${config.params}`, config?.config);
};

export const getMyProjects = (config: OnlyIdProjectConfig): Promise<AxiosResponse<Project[]>> => {
  return api.get(`/projects/by-user/${config.params}`, config?.config);
};

export const updateProjectStatus = (
  config: UpdateProjectStatusConfig
): Promise<AxiosResponse<Project>> => {
  return api.put(`/projects/${config.params.id}/status`, config.params.payload, config?.config);
};
