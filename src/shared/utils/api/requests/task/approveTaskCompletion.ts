import { RequestConfig, Event, TaskCompletionParams } from 'api';
import { AxiosResponse } from 'axios';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ApproveTaskCompletionConfig = RequestConfig<TaskCompletionParams>;
export const approveTaskCompletion = (
  config: ApproveTaskCompletionConfig
): Promise<AxiosResponse<Event>> => {
  const newConfig = addAuthorizationHeader(config.config);
  const message = `${config.params.message}`;
  return api.post(
    `/tasks/${config.params.taskId}/approve-completion`,
    { message: message, creatorId: config.params.creatorId, eventId: config.params.eventId },
    newConfig
  );
};
