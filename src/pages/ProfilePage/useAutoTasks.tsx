import { useTonConnectUI } from "@tonconnect/ui-react";
import { useState, useEffect } from "react";

interface Task {
    category: string;
    completed: boolean;
  }

const baseTasks = [
    { category: 'checkin', completed: false },
    { category: 'welcome-bonus', completed: false },
    { category: 'shere-in-stories', completed: false },
    { category: 'account-bio', completed: false },
    { category: 'web-url', completed: false },
    { category: 'open-x', completed: false },
    { category: 'open-tg', completed: false },
    { category: 'open-youtube', completed: false },
    { category: 'open-tiktok', completed: false },
    { category: 'open-reddit', completed: false },
    { category: 'open-discord', completed: false },
    { category: 'open-whitepaper', completed: false },
    { category: 'open-pitchdek', completed: false },
]
  
const useAutoTasks = () => {
  const [tonConnectUI] = useTonConnectUI();
    
      const [tasks, setTasks] = useState<Task[]>([
        { category: 'wallet', completed: tonConnectUI.connected },
        ...baseTasks
      ]);
    
      // Загрузка состояния задач из localStorage при монтировании компонента
      useEffect(() => {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks && savedTasks?.length > 0) {
          setTasks(JSON.parse(savedTasks));
        } else {
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

      return {
        tasks, 
        markTaskAsCompleted
      }
}

export default useAutoTasks;