import { AutotaskApplication, GetAutotaskApplicationsParams, RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type GetAutotaskApplicationsConfig = RequestConfig<GetAutotaskApplicationsParams>;
export const getAutotaskApplications = ({ params, config }: GetAutotaskApplicationsConfig) => {
  const searchParams = new URLSearchParams();
  if (params.userId) {
    searchParams.append('userId', params.userId.toString());
  }
  if (params.taskId) {
    searchParams.append('taskId', params.taskId.toString());
  }
  return api.get<AutotaskApplication[]>(
    `/auto-tasks/applications?${searchParams.toString()}`,
    addAuthorizationHeader(config)
  );
};
