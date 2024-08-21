import { RequestConfig, User } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';
import { AxiosResponse } from 'axios';

export type AuthMeConfig = RequestConfig;
export const authMe = (config?: AuthMeConfig): Promise<AxiosResponse<User>> => {
  const newConfig = addAuthorizationHeader(config?.config);
  return api.get('/auth/me', newConfig);
};
