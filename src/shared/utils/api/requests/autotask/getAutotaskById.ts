import { AutotaskApplication, RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type GetAutotaskByIdConfig = RequestConfig<{ id: number }>;
export const getAutotaskById = ({ params, config }: GetAutotaskByIdConfig) =>
  api.get<AutotaskApplication>(`/auto-tasks/${params.id}`, addAuthorizationHeader(config));
