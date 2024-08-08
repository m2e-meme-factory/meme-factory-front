import { GetUserByTelegramParams, RequestConfig } from '../../../../../@types/api';
import api from '../../api';

export type GetUserByTelegramConfig = RequestConfig<GetUserByTelegramParams>;
export const getUserByTelegram = (config: GetUserByTelegramConfig) => {
  return api.get(`/users/by-telegram/${config.params.id}`, config?.config)
}