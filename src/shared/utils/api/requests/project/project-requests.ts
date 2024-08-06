import {
  CreateProjectResponse, DeleteProjectResponse, GetProjectResponse,
  GetPublicProjectsResponse,
  Project,
  RequestConfig, UpdateProjectPayload, UpdateProjectResponse,
} from '../../../../../@types/api';
import api from '../../api';

export type CreateProjectConfig = RequestConfig<Project>;
export type GetPublicProjectsConfig = RequestConfig;
export type GetOrDeleteProjectConfig = RequestConfig<string>;
export type UpdateProjectConfig = RequestConfig<UpdateProjectPayload>;

export const createProject = (config: CreateProjectConfig): Promise<CreateProjectResponse> => {
  return api.post('/projects', config.params, config?.config);
};

export const getPublicProjects = (config: GetPublicProjectsConfig): Promise<GetPublicProjectsResponse> => {
  return api.get('/projects', config?.config);
};

export const getProject = (config: GetOrDeleteProjectConfig): Promise<GetProjectResponse> => {
  return api.get(`/projects/${config.params}`);
};

export const updateProject = (config: UpdateProjectConfig): Promise<UpdateProjectResponse> => {
  return api.put(`/projects/${config.params.projectId}`, config.params.project, config?.config);
};

export const deleteProject = (config: GetOrDeleteProjectConfig): Promise<DeleteProjectResponse> => {
  return api.delete(`/projects/${config.params}`);
};