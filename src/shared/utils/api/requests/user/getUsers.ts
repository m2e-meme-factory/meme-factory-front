import api from '../../api';
import { RequestConfig } from 'api';

export type GetUsersConfig = RequestConfig;
export const getUsers = (config: GetUsersConfig) => {
  return api.get('/users', config?.config);
};
