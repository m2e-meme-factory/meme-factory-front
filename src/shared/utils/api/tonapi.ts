import { Api, HttpClient } from '@ton-api/client';
import { Address, Cell } from 'ton-core';

import { Buffer } from 'buffer';
import { env } from '@shared/consts/env';

const httpClient = new HttpClient({
  baseUrl: `${env.tonBaseUrl}`,
});

export const tonapi = new Api(httpClient);

export async function getJettonWalletAddress(
  jettonMasterAddress: string,
  walletAddress: string,
  isArrdess?: boolean
): Promise<string | Address> {
  try {
    const result = await tonapi.blockchain.execGetMethodForBlockchainAccount(
      jettonMasterAddress,
      'get_wallet_address',
      {
        args: [walletAddress],
      }
    );

    if (isArrdess) {
      const readAddress = (cell: string) =>
        Cell.fromBoc(Buffer.from(cell, 'hex'))[0].beginParse().loadAddress();
      const res = readAddress(result.stack[0].cell as string);

      return res;
    }

    return result.decoded.jetton_wallet_address;
  } catch (error) {
    throw error;
  }
}

export async function getJettonBalance(address: string) {
  try {
    const result = await tonapi.accounts.getAccountJettonsBalances(address);

    return result;
  } catch (error) {
    throw error;
  }
}
