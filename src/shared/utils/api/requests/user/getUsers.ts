import { RequestConfig } from '../../../../../@types/api';
import api from '../../api';

export type GetUsersConfig = RequestConfig;
export const getUsers = (config: GetUsersConfig) => {
  return api.get('/users', config?.config);
}