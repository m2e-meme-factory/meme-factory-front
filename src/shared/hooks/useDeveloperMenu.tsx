// useDeveloperMenu.ts
import { useEffect, useRef, useState } from 'react';

const useDeveloperMenu = (clickThreshold: number = 20, resetTimeout: number = 1000) => {
  const [clickCount, setClickCount] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (clickCount >= clickThreshold) {
      setMenuVisible(true);
      setClickCount(0); // Сбросить счётчик после открытия
    }

    console.log("clickCount", clickCount)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [clickCount, clickThreshold]);

  const handleClick = () => {
    setClickCount((prev) => prev + 1);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => setClickCount(0), resetTimeout);
  };

  const clearTutorial = () => {
    localStorage.removeItem('onboardCompleted');
    alert('Tutorial cleared!');
  };

  const clearGuides = () => {
    localStorage.removeItem('guides');
    alert('Guides cleared!');
  };

  return { handleClick, menuVisible, setMenuVisible, clearTutorial, clearGuides };
};

export default useDeveloperMenu;
