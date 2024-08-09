import api from '../../api';
import { GetRefDataParams, GetRefDataResponse, RequestConfig } from 'api';

export type GetRefDataConfig = RequestConfig<GetRefDataParams>;

export const getRefData = (config: GetRefDataConfig): Promise<GetRefDataResponse> => {
  const token = localStorage.getItem('token');

  const newConfig = { ...config };

  newConfig.config = newConfig.config || {};
  newConfig.config.headers = newConfig.config.headers || {};

  if (token) {
    newConfig.config.headers['Authorization'] = `Bearer ${token}`;
  }

  return api.get(`/users/referals_info?telegramId=${config?.params.telegramId}`, newConfig.config);
};
