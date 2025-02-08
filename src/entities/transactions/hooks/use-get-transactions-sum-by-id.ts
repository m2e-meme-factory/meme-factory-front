import { useQuery } from '@tanstack/react-query';

import { QUERY_KEYS } from '@shared/consts/query-keys';

import { getTransactionByType } from '@shared/utils/api/requests/transactions/get-transaction-sum-by-type';

export const useGetTransactionsSumById = (userId: string) => {
  return useQuery({
    queryFn: async () => {
      try {
        const params = { userId: userId };
        return await getTransactionByType({ params });
      } catch (error) {}
    },
    queryKey: [QUERY_KEYS.TRANSACTIONS],
    select: (data) => {
      return data?.data;
    },
  });
};

