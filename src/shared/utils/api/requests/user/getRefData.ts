import api from '../../api';
import { GetRefDataParams, GetRefDataResponse, RequestConfig } from 'api';

export type GetRefDataConfig = RequestConfig<GetRefDataParams>;

export const getRefData = (config: GetRefDataConfig): Promise<GetRefDataResponse> => {
  return api.get(`/users/referals_info?telegramId=${config?.params.telegramId}`);
};
