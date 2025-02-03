import {
  SendTransactionRequest,
  toUserFriendlyAddress,
  useTonConnectUI,
  useTonWallet,
} from '@tonconnect/ui-react';
import { Address, beginCell, Cell, toNano } from 'ton-core';
import { useTranslation } from 'react-i18next';

import { getJettonWalletAddress, getJettonBalance } from '../../tonapi';
import { storeBuyTokens, storeTokenTransfer } from './tact_PresaleMaster';

import { showErrorMessage, showSuccessMessage } from '@shared/utils/helpers/notify';
import { getBalanceJettonAddress } from '@shared/utils/helpers/get-balance-jetton-address';
import { env } from '@shared/consts/env';
import { LOCAL_TEXT } from '@shared/consts';

interface PayCheckParams {
  jettonsAmountToMint: number;
  planSeqno: number;
}

export const usePayMF = () => {
  const { t } = useTranslation();
  const [tonConnectUI] = useTonConnectUI();
  const wallet = useTonWallet();

  const forwardPayload = (planSeqno: number, sender: Address) => {
    return beginCell()
      .store(
        storeBuyTokens({
          $$type: 'BuyTokens',
          plan_seqno: BigInt(planSeqno),
          receiver: sender,
        })
      )
      .endCell()
      .asSlice();
  };

  const createPayload = (
    contractAddress: Address,
    sender: Address,
    jettonsAmountToMint: number,
    planSeqno: number
  ) => {
    const payload: Cell = beginCell()
      .store(
        storeTokenTransfer({
          $$type: 'TokenTransfer',
          query_id: BigInt(0),
          amount: BigInt(jettonsAmountToMint * 1000000),
          sender: contractAddress,
          response_destination: sender,
          custom_payload: null,
          forward_payload: forwardPayload(planSeqno, sender),
          forward_ton_amount: toNano('0.1'),
        })
      )
      .endCell();
    return payload.toBoc().toString('base64');
  };

  const createMSG = async (
    contractAddress: string,
    senderAddress: string,
    jettonMinterAddress: string,
    jettonsAmountToMint: number,
    planSeqno: number
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
      amount: '150000000',
      payload: createPayload(contract, sender, jettonsAmountToMint, planSeqno),
    };
  };

  const mintJettons = async ({ jettonsAmountToMint, planSeqno }: PayCheckParams) => {
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
            jettonsAmountToMint,
            planSeqno
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

