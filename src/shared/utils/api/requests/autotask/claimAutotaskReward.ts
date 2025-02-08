import { RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ClaimAutotaskRewardConfig = RequestConfig<{ taskName: string }>;
export const claimAutotaskReward = ({ params, config }: ClaimAutotaskRewardConfig) => {
  return api.post<void>(
    '/auto-tasks/name-claim',
    { taskName: params.taskName },
    addAuthorizationHeader(config)
  );
};
