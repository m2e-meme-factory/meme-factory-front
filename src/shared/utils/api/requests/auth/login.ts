import { LoginPayload, LoginResponse, RequestConfig } from '../../../../../@types/api';
import api from '../../api';

export type LoginConfig = RequestConfig<LoginPayload>

export const login = (config: LoginConfig): Promise<LoginResponse> => {
  return api.post(`/auth/login`, config.params.initData, config?.config);
}