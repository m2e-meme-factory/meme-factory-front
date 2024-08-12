import api from '../../api';
import { AxiosResponse } from 'axios';
import {
  CreateProjectDTO,
  GetPublicProjectsParams,
  PaginatedProjects,
  Project,
  RequestConfig,
  UpdateProjectPayload,
  UpdateStatusPayload,
} from 'api';

export type CreateProjectConfig = RequestConfig<CreateProjectDTO>;
export type GetPublicProjectsConfig = RequestConfig<GetPublicProjectsParams>;
export type OnlyIdProjectConfig = RequestConfig<string>;
export type UpdateProjectConfig = RequestConfig<UpdateProjectPayload>;
export type UpdateProjectStatusConfig = RequestConfig<UpdateStatusPayload>;

const addAuthorizationHeader = (config: any) => {
  const token = localStorage.getItem('token');

  const newConfig = { ...config };
  newConfig.headers = newConfig.headers || {};

  if (token) {
    newConfig.headers['Authorization'] = `Bearer ${token}`;
  }

  return newConfig;
};

export const createProject = (config: CreateProjectConfig): Promise<AxiosResponse<Project>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.post('/projects', config.params, newConfig);
};

export const getPublicProjects = (
  config: GetPublicProjectsConfig
): Promise<AxiosResponse<PaginatedProjects>> => {
  const newConfig = addAuthorizationHeader(config.config);
  const { tags = [], category, page, limit } = config.params;

  const params = new URLSearchParams();

  if (tags.length) {
    tags.forEach((tag) => params.append('tags', tag));
  }
  if (category) params.append('category', category);
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));

  return api.get(`/projects?${params.toString()}`, newConfig);
};

export const getProject = (config: OnlyIdProjectConfig): Promise<AxiosResponse<Project>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.get(`/projects/${config.params}`, newConfig);
};

export const updateProject = (config: UpdateProjectConfig): Promise<AxiosResponse<Project>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.put(`/projects/${config.params.projectId}`, config.params.project, newConfig);
};

export const deleteProject = (config: OnlyIdProjectConfig): Promise<AxiosResponse> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.delete(`/projects/${config.params}`, newConfig);
};

export const getMyProjects = (config: OnlyIdProjectConfig): Promise<AxiosResponse<Project[]>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.get(`/projects/by-user/${config.params}`, newConfig);
};

export const updateProjectStatus = (
  config: UpdateProjectStatusConfig
): Promise<AxiosResponse<Project>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.put(`/projects/${config.params.id}/status`, config.params.payload, newConfig);
};
