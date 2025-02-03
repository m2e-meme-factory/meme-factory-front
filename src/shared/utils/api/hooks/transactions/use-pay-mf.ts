import {
  SendTransactionRequest,
  toUserFriendlyAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react';
import { Address, beginCell, Cell } from 'ton-core';
import { useTranslation } from 'react-i18next';

import { getJettonWalletAddress, getJettonBalance } from '../../tonapi';

import { showErrorMessage, showSuccessMessage } from '@shared/utils/helpers/notify';
import { getBalanceJettonAddress } from '@shared/utils/helpers/get-balance-jetton-address';
import { env } from '@shared/consts/env';
import { LOCAL_TEXT } from '@shared/consts';

interface PayCheckParams {
  jettonsAmountToMint: number;
}

export const usePayMF = () => {
  const { t } = useTranslation();
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const createPayload = (
    contractAddress: Address,
    sender: Address,
    jettonsAmountToMint: number
  ) => {
    const payload: Cell = beginCell()
      .storeUint(0x0f8a7ea5, 32) // op
      .storeUint(0, 64) // query_id
      .storeCoins(jettonsAmountToMint * 1000000)
      .storeAddress(contractAddress)
      .storeAddress(sender)
      .storeBit(0)
      .storeCoins(1)
      .storeBit(0)
      .endCell();
    return payload.toBoc().toString('base64');
  };

  const createMSG = async (
    contractAddress: string,
    senderAddress: string,
    jettonMinterAddress: string,
    jettonsAmountToMint: number
  ) => {
    const contract: Address = Address.parseFriendly(contractAddress).address;
    const sender: Address = Address.parseFriendly(senderAddress).address;
    const jettonAddress: Address = Address.parseFriendly(jettonMinterAddress).address;

    const walletAddress: string = (await getJettonWalletAddress(
      jettonAddress.toRawString(),
      sender.toRawString()
    )) as string;

    return {
      address: walletAddress as string,
      amount: '50000000',
      payload: createPayload(contract, sender, jettonsAmountToMint),
    };
  };

  const mintJettons = async ({ jettonsAmountToMint }: PayCheckParams) => {
    const senderAddress = wallet?.account.address;
    const jettonMinterAddress = env.minterUSDT;
    const contractAddress = env.minterContract;

    try {
      if (senderAddress && jettonMinterAddress) {
        const balances = await getJettonBalance(senderAddress);

        const jettonBalance = getBalanceJettonAddress(
          balances,
          Address.parseFriendly(jettonMinterAddress).address.toRawString()
        );

        if (
          jettonsAmountToMint &&
          contractAddress &&
          jettonBalance !== 0 &&
          jettonBalance > jettonsAmountToMint
        ) {
          const msg = await createMSG(
            contractAddress,
            toUserFriendlyAddress(senderAddress),
            jettonMinterAddress,
            jettonsAmountToMint
          );

          const secondsInMinute = 60;
          const minutes = 10;
          const waitingTime = minutes * secondsInMinute;
          const transaction: SendTransactionRequest = {
            validUntil: Math.floor(Date.now() / 1000) + waitingTime,
            messages: [msg],
          };

          try {
            await tonConnectUI.sendTransaction(transaction);
            showSuccessMessage(t(LOCAL_TEXT.NTF_BOUGHT_SUCCESSFULLY));
          } catch (error) {
            showErrorMessage(t(LOCAL_TEXT.CANCEL));
            throw error;
          }
        } else if (jettonBalance !== 0 || jettonBalance > jettonsAmountToMint) {
          showErrorMessage(t(LOCAL_TEXT.NOT_ENOUGH_TOKENS));
        }
      }
    } catch (error) {}
  };

  return { functions: { mintJettons } };
};

