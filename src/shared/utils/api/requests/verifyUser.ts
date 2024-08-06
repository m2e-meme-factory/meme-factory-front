import {
  RequestConfig,
  VerifyUserData,
  VerifyUserRequestData,
  VerifyUserResponse,
} from '../../../../@types/api';
import api from '../api';

export type VerifyUserConfig = RequestConfig<VerifyUserRequestData>;

export const verifyUser = (config: VerifyUserConfig): Promise<VerifyUserResponse> => {
  return api.post(
    `/verify_user?query_id=${config?.params.queryId}`,
    config?.params.userData,
    config?.config
  );
};
