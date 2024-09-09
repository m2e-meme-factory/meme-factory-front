import { DownloadFilesParams, RequestConfig } from 'api';
import { AxiosResponse } from 'axios';
import api from '../../api';

export type DownloadFilesConfig = RequestConfig<DownloadFilesParams>;

export const downloadFiles = (config: DownloadFilesConfig): Promise<AxiosResponse> => {
  return api.get(`/projects/${config.params.projectId}/files_tg/${config.params.telegramId}`);
};
