import api from '../../api';
import { RequestConfig, VerifyUserRequestData, VerifyUserResponse } from 'api';

export type VerifyUserConfig = RequestConfig<VerifyUserRequestData>;

export const verifyUser = (config: VerifyUserConfig): Promise<VerifyUserResponse> => {
  return api.post(`/verify_user`, { userId: config?.params.userId }, config?.config);
};
