import { GetTxByUserParams, RequestConfig, Transaction } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';
import { AxiosResponse } from 'axios';

export type GetTxByUserConfig = RequestConfig<GetTxByUserParams>;
export const getTxByUser = (config: GetTxByUserConfig): Promise<AxiosResponse<Transaction[]>> => {
  const newConfig = addAuthorizationHeader(config.config);
  return api.get(`/transactions/by-user?userId=${config.params.userId}`, newConfig);
};
