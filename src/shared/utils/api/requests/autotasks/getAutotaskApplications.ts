import api from '../../api';
import { AutotaskApplicationDTO, GetAutotaskApplicationsParams, RequestConfig } from 'api';
import { addAuthorizationHeader } from '../project/project-requests';
import { AxiosResponse } from 'axios';

export type GetAutotaskApplicationsConfig = RequestConfig<GetAutotaskApplicationsParams>;

export const getAutotaskApplications = (
  config?: GetAutotaskApplicationsConfig
): Promise<AxiosResponse<AutotaskApplicationDTO[]>> => {
  const newConfig = addAuthorizationHeader(config?.config);
  const params = new URLSearchParams();

  if (config?.params.userId) params.append('userId', config?.params.userId.toString());

  return api.get(`/autotask-applications?${params.toString()}`, newConfig);
};
