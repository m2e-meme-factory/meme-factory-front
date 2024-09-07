import { RequestConfig, VerifyUserRequestData, VerifyUserResponse } from 'api';
import { addAuthorizationHeader } from '../project/project-requests';
import api from '../../api';

export type VerifyUserConfig = RequestConfig<VerifyUserRequestData>;

export const verifyUser = (config: VerifyUserConfig): Promise<VerifyUserResponse> => {
  const newConfig = addAuthorizationHeader(config);
  return api.post(`users/verify_user`, { user_id: newConfig?.params.userId }, newConfig);
};
