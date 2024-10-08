import { RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ClaimAutotaskRewardConfig = RequestConfig<{ taskId: number }>;
export const claimAutotaskReward = ({ params, config }: ClaimAutotaskRewardConfig) =>
  api.put<void>(`/auto-tasks/${params.taskId}/claim`, {}, addAuthorizationHeader(config));
