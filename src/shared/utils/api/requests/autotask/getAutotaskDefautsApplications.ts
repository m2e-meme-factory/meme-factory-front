import { AutotaskApplication, GetAutotaskDefaultsApplicationsParams, RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type GetAutotaskDefalultsApplicationsConfig = RequestConfig<GetAutotaskDefaultsApplicationsParams>;
export const getAutotaskDefautsApplications = ({ params, config }: GetAutotaskDefalultsApplicationsConfig) => {
  const searchParams = new URLSearchParams();
  if (params.userId) {
    searchParams.append('userId', params.userId.toString());
  }
  if (params.taskCategory) {
    searchParams.append('taskCategory', params.taskCategory);
  }
  return api.get<AutotaskApplication[]>(
    `/auto-tasks/defaults/applications?${searchParams.toString()}`,
    addAuthorizationHeader(config)
  );
};
