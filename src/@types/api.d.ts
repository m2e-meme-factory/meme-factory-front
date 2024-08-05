import type { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface VerifyUserData {
  userId: string;
  name: string;
  phoneNumber: string;
  email: string;
}

export interface Subtask {
  id: string;
  title: string;
  description: string;
  price: number;
}

export interface VerifyUserRequestData {
  queryId: string;
  userData: VerifyUserData;
}

enum EventType {
  PROJECT_CREATED = 'PROJECT_CREATED',
  PROJECT_UPDATED = 'PROJECT_UPDATED',
  PROJECT_DELETED = 'PROJECT_DELETED',
  APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
  APPLICATION_APPROVED = 'APPLICATION_APPROVED',
  APPLICATION_REJECTED = 'APPLICATION_REJECTED',
  TASK_COMPLETED = 'TASK_COMPLETED',
  TASK_UPDATED = 'TASK_UPDATED',
  TRANSACTION_COMPLETED = 'TRANSACTION_COMPLETED',
  DISPUTE_OPENED = 'DISPUTE_OPENED',
  DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
  USER_MESSAGE = 'USER_MESSAGE',
  RATING_GIVEN = 'RATING_GIVEN',
}

enum Role {
  CREATOR = 'creator',
  ADVISER = 'adviser',
}

interface LogDetails {
  transactionId?: number;
  message?: string;
  amount?: number;
  subtaskId?: number;
}

interface LogEntry {
  id: number;
  projectId: number;
  userId: number;
  role: Role;
  eventType: EventType;
  description?: string;
  createdAt: Date;
  details: LogDetails;
}

export interface UpdateProjectPayload {
  projectId: string;
  project: Project;
}

interface Transaction {
  id: number;
  projectId: number;
  taskId: number;
  fromUserId: number;
  toUserId: number;
  amount: number;
  createdAt: Date;
}

enum DisputeStatus {
  OPEN = 'open',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

interface Dispute {
  id: string;
  projectId: string;
  initiatorId: string;
  defendantId: string;
  reason: string;
  status: DisputeStatus;
  creationDate: string;
  resolutionDate?: string;
}

export interface GetUserDataParams {
  query_id: string;
  user_id: string;
}

export interface GetRefDataParams {
  query_id: string;
  ref_id: string;
}

export type ApiRequestConfig = AxiosRequestConfig;

export type RequestConfig<Params = undefined> = Params extends undefined
  ? { config?: ApiRequestConfig }
  : { params: Params; config?: ApiRequestConfig };

export interface User {
  id: string;
  telegramId: string;
  username: string;
  role: Role;
  isBanned: boolean;
  isVerified: boolean;
  createdAt: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  bannerUrl: string;
  attachedFiles: string[];
  category: string;
  tags: string[];
  price: number;
  tasks: Subtask[];
  creatorId: string;
  creationDate: Date;
  status: string;
}

//TODO: specify response types for each request
export type VerifyUserResponse = AxiosResponse<any>;
export type GetUserDataResponse = AxiosResponse<any>;
export type GetRefDataResponse = AxiosResponse<any>;
export type CreateProjectResponse = AxiosResponse<Project>;
export type GetPublicProjectsResponse = AxiosResponse<Project[]>;
export type GetProjectResponse = AxiosResponse<Project>;
export type UpdateProjectResponse = AxiosResponse<Project>;
export type DeleteProjectResponse = AxiosResponse<any>;
