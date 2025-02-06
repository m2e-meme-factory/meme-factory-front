import { useQuery } from '@tanstack/react-query';

import { getAllAutotasks } from '@shared/utils/api/requests/autotask/getAllAutotasks';
import { QUERY_KEYS } from '@shared/consts/query-keys';

export const useGetMapAutoTasks = (userId?: number) => {
  return useQuery({
    queryFn: () => getAllAutotasks({}),
    queryKey: [QUERY_KEYS.AUTOTASKS, userId],
    select: (data) => {
      const createNewMap = new Map(
        data.data.map((task) => [task.name, { reward: task.reward, isClaimed: task.isClaimed }])
      );
      return createNewMap;
    },
  });
};

