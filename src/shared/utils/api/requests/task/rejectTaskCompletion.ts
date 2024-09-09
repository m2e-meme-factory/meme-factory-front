import { RequestConfig, Event, TaskCompletionParams } from 'api';
import { AxiosResponse } from 'axios';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type RejectTaskCompletionConfig = RequestConfig<TaskCompletionParams>;
export const rejectTaskCompletion = (
  config: RejectTaskCompletionConfig
): Promise<AxiosResponse<Event>> => {
  const newConfig = addAuthorizationHeader(config.config);
  const message = `Task ${config.params.taskId} completion was rejected by project host. Project host message: ${config.params.message}`;
  return api.post(
    `/tasks/${config.params.taskId}/reject-completion`,
    { message: message, creatorId: config.params.creatorId, eventId: config.params.eventId },
    newConfig
  );
};
