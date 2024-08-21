import api from '../../api';
import { AxiosResponse } from 'axios';
import {
  AcceptApplicationForProjectParams,
  ApplyForProjectParams,
  CreateProjectDTO,
  FreelancersResponse,
  GetEventsByProjectIdParams,
  GetMyProjectsParams,
  GetProgressByProjectIdParams,
  GetProjectFreelancersParams,
  GetPublicProjectsParams,
  GetTotalSpendingsParams,
  GetUserProgressesParams,
  PaginatedProjects,
  ProgressWithProjectResponse,
  Project,
  ProjectProgress,
  RejectApplicationForProjectParams,
  RequestConfig,
  UpdateProjectPayload,
  UpdateStatusPayload,
} from 'api';

export type CreateProjectConfig = RequestConfig<CreateProjectDTO>;
export type GetPublicProjectsConfig = RequestConfig<GetPublicProjectsParams>;
export type OnlyIdProjectConfig = RequestConfig<string>;
export type UpdateProjectConfig = RequestConfig<UpdateProjectPayload>;
export type UpdateProjectStatusConfig = RequestConfig<UpdateStatusPayload>;
export type GetMyProjectsConfig = RequestConfig<GetMyProjectsParams>;
export type GetProgressByProjectIdConfig = RequestConfig<GetProgressByProjectIdParams>;
export type ApplyForProjectConfig = RequestConfig<ApplyForProjectParams>;
export type GetEventsByProjectIdConfig = RequestConfig<GetEventsByProjectIdParams>;
export type AcceptApplicationForProjectConfig = RequestConfig<AcceptApplicationForProjectParams>;
export type RejectApplicationForProjectConfig = RequestConfig<RejectApplicationForProjectParams>;
export type GetUserProgressesConfig = RequestConfig<GetUserProgressesParams>;
export type GetProjectFreelancersConfig = RequestConfig<GetProjectFreelancersParams>;
export type GetTotalSpendingsConfig = RequestConfig<GetTotalSpendingsParams>;

export const addAuthorizationHeader = (config: any) => {
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

export const getMyProjects = (
  config: GetMyProjectsConfig
): Promise<AxiosResponse<PaginatedProjects>> => {
  const newConfig = addAuthorizationHeader(config.config);

  const { page, limit } = config.params;
  const params = new URLSearchParams();
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));

  return api.get(`/projects/by-user/${config.params.userId}?${params.toString()}`, newConfig);
};

export const updateProjectStatus = (
  config: UpdateProjectStatusConfig
): Promise<AxiosResponse<Project>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.put(`/projects/${config.params.id}/status`, config.params.payload, newConfig);
};

export const getProgressByProjectId = (
  config: GetProgressByProjectIdConfig
): Promise<AxiosResponse<ProjectProgress[]>> => {
  const newConfig = addAuthorizationHeader(config.config);
  const optionalUser = config.params.userId ? `?creatorId=${config.params.userId}` : '';
  return api.get(
    `/projects/progress/by-project/${config.params.projectId}${optionalUser}`,
    newConfig
  );
};

export const applyForProject = (
  config: ApplyForProjectConfig
): Promise<AxiosResponse<ProjectProgress>> => {
  const newConfig = addAuthorizationHeader(config.config);
  const message = `Application sent. User message: ${config.params.message}`;
  return api.post(
    `/projects/${config.params.projectId}/apply`,
    { message: config.params.message },
    newConfig
  );
};

export const getEventsByProgressId = (
  config: GetEventsByProjectIdConfig
): Promise<AxiosResponse<Event[]>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.get(`/projects/progress/${config.params.progressId}/events`, newConfig);
};

export const acceptApplicationForProject = (config: AcceptApplicationForProjectConfig) => {
  const newConfig = addAuthorizationHeader(config.config);
  const message = `Application accepted. Now user can earn money fulfilling tasks. Host message: ${config.params.message}`;
  return api.post(
    `/projects/progress/${config.params.progressId}/accept`,
    { message: message },
    newConfig
  );
};

export const rejectApplicationForProject = (config: RejectApplicationForProjectConfig) => {
  const newConfig = addAuthorizationHeader(config.config);
  const message = `Application rejected. Try again later. Host message: ${config.params.message}`;
  return api.post(
    `/projects/progress/${config.params.progressId}/reject`,
    { message: message },
    newConfig
  );
};

export const getUserProgresses = (
  config: GetUserProgressesConfig
): Promise<AxiosResponse<ProgressWithProjectResponse[]>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.get(`/projects/progress/by-creator/${config.params.userId}`, newConfig);
};

export const getProjectFreelancers = (
  config: GetProjectFreelancersConfig
): Promise<AxiosResponse<FreelancersResponse[]>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.get(
    `/projects/${config.params.projectId}/freelancers?status=${config.params.status}`,
    newConfig
  );
};

export const getTotalSpendings = (
  config: GetTotalSpendingsConfig
): Promise<AxiosResponse<number>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.get(`/projects/${config.params.projectId}/cost`, newConfig);
};
