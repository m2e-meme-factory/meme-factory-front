import api from '../../api';
import { ApplyTaskCompletionParams, RequestConfig, Event } from 'api';
import { AxiosResponse } from 'axios';
import { addAuthorizationHeader } from '../project/project-requests';

export type ApplyTaskCompletionConfig = RequestConfig<ApplyTaskCompletionParams>;

export const applyTaskCompletion = (
  config: ApplyTaskCompletionConfig
): Promise<AxiosResponse<Event>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.post(
    `/tasks/${config.params.taskId}/apply-completion`,
    { message: config.params.message },
    newConfig
  );
};
