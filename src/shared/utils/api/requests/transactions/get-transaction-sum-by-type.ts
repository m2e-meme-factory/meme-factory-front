import { RequestConfig, Transaction } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';
import { AxiosResponse } from 'axios';

export type GetTransactionByTypeConfig = RequestConfig<{ userId: string }>;

export const getTransactionByType = ({
  params,
  config,
}: GetTransactionByTypeConfig): Promise<AxiosResponse<Transaction>> => {
  const newConfig = addAuthorizationHeader(config);
  return api.post(
    `/transactions/sum-by-type`,
    { toUserId: params.userId, type: 'REFERAL' },
    newConfig
  );
};

