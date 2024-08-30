import { ClaimRewardParams, RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ClaimRewardConfig = RequestConfig<ClaimRewardParams>;
export const claimReward = (config?: ClaimRewardConfig) => {
  const newConfig = addAuthorizationHeader(config?.config);
  return api.post(
    `/autotask-applications/${config?.params.applicationId}/claim`,
    { userId: config?.params.userId },
    newConfig
  );
};
