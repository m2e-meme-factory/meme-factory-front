import { Autotask, RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type GetAllAutotasksConfig = RequestConfig;
export const getAllAutotasks = ({ config }: GetAllAutotasksConfig) =>
  api.get<Autotask[]>('/auto-tasks/defaults', addAuthorizationHeader(config));
