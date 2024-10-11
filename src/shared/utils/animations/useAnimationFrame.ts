import { useEffect, useRef } from 'react';

export default function useAnimationFrame(
  callback: (deltaTime: number) => void,
  dependencies: any[]
) {
  const requestRef = useRef<number | undefined>();
  const previousTimeRef = useRef<number | undefined>();

  const animate = (time: number) => {
    if (previousTimeRef.current != null) {
      const deltaTime = time - previousTimeRef.current;
      callback(deltaTime);
    }
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, dependencies); // Update animation frame on dependencies change
}
