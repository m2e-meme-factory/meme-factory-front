import { useEffect, useCallback, useRef } from 'react';

import { useTonConnectUI } from '@tonconnect/ui-react';

import { useClimeAutoTask, useGetMapAutoTasks } from '@entities/auto-tasks';

import { CATEGORY_TASKS } from '@shared/consts/category-tasks';

const useAutoTasks = () => {
  const [tonConnectUI] = useTonConnectUI();
      const [tasks, setTasks] = useState<Task[]>([
        { category: 'wallet', completed: tonConnectUI.connected },
        ...baseTasks
      ]);
    
      // Загрузка состояния задач из localStorage при монтировании компонента
      useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks && savedTasks.length > 0) {
          const parsedSavedTasks: Task[] = JSON.parse(savedTasks);
          const savedCategories = new Set(parsedSavedTasks.map(t => t.category));
          
          // Добавляем задачи из baseTasks, которых нет в сохраненных
          const missingBaseTasks = baseTasks.filter(t => !savedCategories.has(t.category));
          let mergedTasks: Task[] = [...parsedSavedTasks, ...missingBaseTasks];
          
          // Проверяем наличие задачи 'wallet'
          const hasWallet = parsedSavedTasks.some(t => t.category === 'wallet');
          if (!hasWallet) {
            mergedTasks = [{ category: 'wallet', completed: tonConnectUI.connected }, ...mergedTasks];
          }
          
          setTasks(mergedTasks);
        } else {
          // Инициализируем с базовыми задачами и 'wallet'
          setTasks([
            { category: 'wallet', completed: tonConnectUI.connected },
            ...baseTasks
          ]);
        }
      }, []);
    
      useEffect(() => {
        const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
          if (wallet) {
            markTaskAsCompleted('wallet');
          }
        });
    
        return () => unsubscribe();
      }, [tonConnectUI]);
    
      // Функция для отметки задачи выполненной
      const markTaskAsCompleted = (category: string) => {
        const newtasks = tasks.map((task) =>
          task.category === category ? { ...task, completed: true } : task
        );
    
        setTasks(newtasks);
    
        localStorage.setItem('tasks', JSON.stringify(newtasks));
      };

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
