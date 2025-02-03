import { JettonsBalances } from '@ton-api/client';

export const getBalanceJettonAddress = (
  balances: JettonsBalances | undefined,
  jettonAddressRaw: string
): number => {
  if (balances) {
    for (const balance of balances.balances) {
      if (balance.jetton.address === jettonAddressRaw) {
        return Number(balance.balance) / Math.pow(10, balance.jetton.decimals);
      }
    }
  }

  return 0;
};

