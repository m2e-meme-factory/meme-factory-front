import { useEffect, useCallback, useRef } from 'react';

import { useTonConnectUI } from '@tonconnect/ui-react';

import { useClimeAutoTask, useGetMapAutoTasks } from '@entities/auto-tasks';

import { CATEGORY_TASKS } from '@shared/consts/category-tasks';

const useAutoTasks = () => {
  const [tonConnectUI] = useTonConnectUI();
  const { data: mapAutoTasks, isLoading, isFetched } = useGetMapAutoTasks();
  const { mutate: onClimeAutoTask } = useClimeAutoTask();

  const abortControllerRef = useRef<AbortController | null>(null);

  const handleMarkTaskAsCompleted = useCallback(
    (category: string) => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      const params = { taskName: category };

      onClimeAutoTask({ params, config: { signal: abortController.signal } });
    },
    [onClimeAutoTask]
  );

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet && mapAutoTasks && !mapAutoTasks?.get(CATEGORY_TASKS.WALLET)?.isClaimed) {
        handleMarkTaskAsCompleted(CATEGORY_TASKS.WALLET);
      }
    });

    return () => unsubscribe();
  }, [handleMarkTaskAsCompleted, tonConnectUI, mapAutoTasks]);

  return {
    mapAutoTasks,
    isLoading: isLoading || isFetched,
    handleMarkTaskAsCompleted,
  };
};

export default useAutoTasks;
