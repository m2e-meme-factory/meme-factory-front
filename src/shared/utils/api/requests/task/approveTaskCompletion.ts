import { RequestConfig, Event, ApproveTaskCompletionParams } from 'api';
import { AxiosResponse } from 'axios';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ApproveTaskCompletionConfig = RequestConfig<ApproveTaskCompletionParams>;
export const approveTaskCompletion = (
  config: ApproveTaskCompletionConfig
): Promise<AxiosResponse<Event>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.post(
    `/tasks/${config.params.taskId}/approve-completion`,
    { message: config.params.message },
    newConfig
  );
};
