// import { RequestConfig } from 'api';
// import api from '../../api';
// import { addAuthorizationHeader } from '../project/project-requests';

// export type ApplyAutotaskDefaultsCompletionConfig = RequestConfig<{ taskCategory: string }>;
// export const applyForAutotaskDefaultsCompletion = ({ params, config }: ApplyAutotaskDefaultsCompletionConfig) =>
//   api.post<void>(`/auto-tasks/defaults/${params.taskCategory}/apply`, {}, addAuthorizationHeader(config));

import { RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ApplyAutotaskDefaultsCompletionConfig = RequestConfig<{ amount: string }>;
export const applyForAutotaskDefaultsCompletion = ({ params, config }: ApplyAutotaskDefaultsCompletionConfig) =>
  api.post<void>(`/auto-task/default/god-claim`, params, addAuthorizationHeader(config));
