import { AutotaskApplicationDTO, CreateAutotaskApplicationDTO, RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';
import { AxiosResponse } from 'axios';

export type ApplyForAutotaskConfig = RequestConfig<CreateAutotaskApplicationDTO>;
export const applyForAutotask = (
  config?: ApplyForAutotaskConfig
): Promise<AxiosResponse<AutotaskApplicationDTO>> => {
  const newConfig = addAuthorizationHeader(config?.config);
  return api.post('/autotask-applications', config?.params, newConfig);
};
