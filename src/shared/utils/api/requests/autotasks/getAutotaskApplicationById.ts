import api from '../../api';
import { GetAutoTaskApplicationByIdParams, RequestConfig } from 'api';
import { addAuthorizationHeader } from '../project/project-requests';

export type GetAutotaskEventByIdConfig = RequestConfig<GetAutoTaskApplicationByIdParams>;

export const getAutotaskApplicationById = (config?: GetAutotaskEventByIdConfig) => {
  const newConfig = addAuthorizationHeader(config?.config);
  return api.get(`/autotask-applications/${config?.params.applicationId}`, newConfig);
};
