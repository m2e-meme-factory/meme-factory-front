declare module 'api' {
  import type { AxiosRequestConfig, AxiosResponse } from 'axios';
  import { Role } from '../shared/consts/userRoles';

  export interface VerifyUserData {
    userId: string;
    name: string;
    phoneNumber: string;
    email: string;
  }

  export interface GetTxByUserParams {
    userId: string;
  }

  export interface CreateEventDto {
    projectId: number;
    userId: number;
    role: Role;
    eventType: EventType;
    description?: string;
    details?: EventDetails;
    progressProjectId?: number;
    message?: string;
  }

  export interface DownloadFilesParams {
    projectId: string;
    telegramId: string;
  }

  export interface GetPublicProjectsParams {
    tags?: string[];
    category?: string;
    page: number;
    limit: number;
  }

  export interface GetMyProjectsParams {
    userId: string;
    page: number;
    limit: number;
  }

  export interface TaskInfo {
    id: string;
    title: string;
    description: string;
    price: number;
  }

  export interface Task {
    projectId: string;
    task: TaskInfo;
    taskId: string;
  }

  interface ProjectProgress {
    id: number;
    userId: number;
    projectId: number;
    status: 'pending' | 'accepted' | 'rejected';
    createdAt: Date;
    updatedAt?: Date;
    events: Event[];
    user: User;
    appliedTasks: number[];
    approvedTasks: number[];
    rejectedTasks: number[];
  }

  export interface VerifyUserRequestData {
    queryId: string;
    userData: VerifyUserData;
  }

  interface EventDetails {
    transactionId?: number;
    amount?: number;
    taskId?: number;
    approvedEventId?: number;
  }

  enum EventType {
    APPLICATION_SUBMITTED = 'APPLICATION_SUBMITTED',
    APPLICATION_APPROVED = 'APPLICATION_APPROVED',
    APPLICATION_REJECTED = 'APPLICATION_REJECTED',
    TASK_SUBMIT = 'TASK_SUBMIT',
    TASK_REJECTED = 'TASK_REJECTED',
    TASK_COMPLETED = 'TASK_COMPLETED',
    DISPUTE_OPENED = 'DISPUTE_OPENED',
    DISPUTE_RESOLVED = 'DISPUTE_RESOLVED',
    USER_MESSAGE = 'USER_MESSAGE',
  }

  export interface Event {
    id: number;
    progressProjectId: string;
    projectId: number;
    userId: number;
    role: Role;
    message: string;
    eventType: EventType;
    description?: string;
    createdAt: Date;
    details?: EventDetails;
  }

  interface FreelancersResponse {
    progress: ProjectProgress;
    user: User;
  }

  interface ProgressWithProjectResponse {
    progress: ProjectProgress;
    project: ProjectData;
  }

  export interface UpdateProjectPayload {
    projectId: string;
    project: UpdateProjectDTO;
  }

  export interface UpdateProjectDTO {
    title: string;
    description: string;
    bannerUrl: string | null;
    files: string[];
    category: string | null;
    tags: string[];
    subtasks: UpdateTaskDTO[];
    deletedTasks: string[];
    authorId: string | undefined;
  }

  export interface UpdateTaskDTO {
    id?: string;
    title: string;
    description: string;
    price: number;
  }

  export interface CreateProjectDTO {
    title: string;
    description: string;
    bannerUrl: string | null;
    files: string[];
    category: string | null;
    tags: string[];
    subtasks: CreateSubtaskDTO[];
    authorId: string | undefined;
  }

  interface Transaction {
    id: number;
    projectId: number;
    taskId: number;
    fromUserId: number;
    toUserId: number;
    amount: number;
    createdAt: Date;
    toUser: User;
    fromUser: User;
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
    inviterRefCode?: string;
    refCode?: string;
    balance: string;
  }

  export interface GetProgressByProjectIdParams {
    projectId: string;
    userId?: string;
  }

  export interface ApplyForProjectParams {
    projectId: string;
    message: string;
  }

  export interface GetEventsByProjectIdParams {
    progressId: string;
  }

  export interface AcceptApplicationForProjectParams {
    progressId: string;
    message: string;
  }

  export interface RejectApplicationForProjectParams {
    progressId: string;
    message: string;
  }

  export interface GetUserProgressesParams {
    userId: string;
  }

  export interface GetProjectFreelancersParams {
    projectId: string;
    status: 'accepted' | 'pending' | 'rejected';
  }

  export interface GetTotalSpendingsParams {
    projectId: string;
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

  export interface PaginatedProjects {
    projects: Project[];
    total: number;
  }

  interface ApplyTaskCompletionParams {
    taskId: string;
    message: string;
  }

  interface TaskCompletionParams {
    taskId: number;
    message: string;
    creatorId: number;
  }

  export interface ProjectData {
    id: string;
    title: string;
    description: string;
    bannerUrl: string;
    files: string[];
    category: string;
    tags: string[];
    tasks: Task[];
    authorId: string;
    status: ProjectStatus;
    author: User;
  }

  export interface Project {
    project: ProjectData;
    maxPrice: string | null;
    minPrice: string | null;
  }

  export interface UpdateStatusPayload {
    id: string;
    payload: { status: ProjectStatus };
  }

  export interface RefDataResponse {
    refLink: string;
    count: number;
  }

  export type VerifyUserResponse = AxiosResponse<any>;
  export type GetUserDataResponse = AxiosResponse<UserWithRef>;
  export type GetRefDataResponse = AxiosResponse<RefDataResponse>;
  export type LoginResponse = AxiosResponse<LoginResponseData>;
}
