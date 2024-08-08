declare module 'api' {
  import type { AxiosRequestConfig, AxiosResponse } from 'axios';

  export interface VerifyUserData {
    userId: string;
    name: string;
    phoneNumber: string;
    email: string;
  }

  export interface SubtaskInfo {
    id: string;
    title: string;
    description: string;
    price: number;
  }

  export interface Subtask {
    projectId: string;
    task: SubtaskInfo;
    taskId: string;
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
    project: CreateProjectDTO;
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

  enum ProjectStatus {
    DRAFT = 'draft',
    MODERATION = 'moderation',
    PUBLISHED = 'published',
    NOT_ACCEPTED = 'not_accepted',
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
    user_id: string;
  }

  export interface GetUserByIdParams {
    id: string;
  }

  export interface GetUserByTelegramParams {
    id: number;
  }

  export interface GetRefDataParams {
    telegramId: string;
  }

  export interface LoginPayload {
    initData: { initData: string };
  }

  export type ApiRequestConfig = AxiosRequestConfig;

  export interface LoginResponseData {
    token: string;
    user: User;
  }

  export type RequestConfig<Params = undefined> = Params extends undefined
    ? { config?: ApiRequestConfig }
    : { params: Params; config?: ApiRequestConfig };

  export interface User {
    id: string;
    telegramId: string;
    username: string;
    role: Role;
    isBaned: boolean;
    isVerified: boolean;
    createdAt: Date;
  }

  export interface UserWithRef {
    id: number;
    telegramId: string;
    username: string;
    isBaned: boolean;
    isVerified: boolean;
    createdAt: Date;
    inviterRefCode?: string;
    refCode: string;
  }

  export interface CreateSubtaskDTO {
    title: string;
    description: string;
    price: number;
  }

  export interface Project {
    id: string;
    title: string;
    description: string;
    bannerUrl: string;
    files: string[];
    category: string;
    tags: string[];
    price: number;
    tasks: Subtask[];
    authorId: string;
    creationDate: Date;
    status: ProjectStatus;
  }

  export interface UpdateStatusPayload {
    id: string;
    payload: { status: ProjectStatus };
  }

  export interface CreateProjectDTO {
    title: string;
    description: string;
    bannerUrl: string | null;
    files: string[];
    category: string | null;
    tags: string[];
    price: number;
    subtasks: CreateSubtaskDTO[];
    authorId: string | undefined;
  }

  export type VerifyUserResponse = AxiosResponse<any>;
  export type GetUserDataResponse = AxiosResponse<UserWithRef>;
  export type GetRefDataResponse = AxiosResponse<any>;
  export type LoginResponse = AxiosResponse<LoginResponseData>;
}
