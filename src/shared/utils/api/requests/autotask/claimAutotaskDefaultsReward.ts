import { RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ClaimAutotaskDefaultsRewardConfig = RequestConfig<{ taskCategory: string }>;
export const claimAutotaskDefaultsReward = ({ params, config }: ClaimAutotaskDefaultsRewardConfig) =>
  api.put<void>(`/auto-tasks/defaults/${params.taskCategory}/claim`, {}, addAuthorizationHeader(config));
