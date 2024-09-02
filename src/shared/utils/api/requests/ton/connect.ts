import { ConnectWalletDTO, RequestConfig } from 'api';
import api from '../../api';
import { addAuthorizationHeader } from '../project/project-requests';

export type ConnectWalletConfig = RequestConfig<ConnectWalletDTO>;
export const connectWallet = (config?: ConnectWalletConfig) => {
  const newConfig = addAuthorizationHeader(config);
  return api.post('/ton/connect', config?.params, newConfig);
};
