import api from '../../api';
import { GetUserDataParams, GetUserDataResponse, RequestConfig } from 'api';

export type GetUserDataConfig = RequestConfig<GetUserDataParams>;

export const getUserData = (config: GetUserDataConfig): Promise<GetUserDataResponse> => {
  return api.get(`/users/get_user_data?userId=${config?.params.user_id}`, config?.config);
};
