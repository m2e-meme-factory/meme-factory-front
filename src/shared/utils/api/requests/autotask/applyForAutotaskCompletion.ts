import { RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ApplyAutotaskCompletionConfig = RequestConfig<{ taskId: number }>;
export const applyAutotaskCompletion = ({ params, config }: ApplyAutotaskCompletionConfig) =>
  api.post<void>(`/auto-tasks/${params.taskId}/apply`, {}, addAuthorizationHeader(config));
