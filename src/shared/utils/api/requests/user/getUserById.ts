import { GetUserByIdParams, RequestConfig } from '../../../../../@types/api';
import api from '../../api';

export type GetUserByIdConfig = RequestConfig<GetUserByIdParams>;
export const getUserById = (config: GetUserByIdConfig) => {
  return api.get(`/users/getUserById/${config.params.id}`, config?.config);
}