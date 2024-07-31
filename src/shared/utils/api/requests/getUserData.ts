import { GetUserDataParams, GetUserDataResponse, RequestConfig } from '../../../../@types/api';
import api from '../api';

export type GetUserDataConfig = RequestConfig<GetUserDataParams>;

export const getUserData = (config: GetUserDataConfig): Promise<GetUserDataResponse> => {
  return api.get(
    `/get_user_data?query_id=${config?.params.query_id}&user_id=${config?.params.user_id}`,
    config?.config
  );
};
