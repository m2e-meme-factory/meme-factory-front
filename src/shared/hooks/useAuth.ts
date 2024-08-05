import { useEffect, useState } from 'react';
import { useTelegram } from './useTelegram';

interface AuthResponse {
  success: boolean;
}

export const useAuth = () => {
  const { webApp, unsafeData } = useTelegram();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const validateAuth = async () => {
      if (webApp && unsafeData) {
        try {
          const response = await fetch('/api/validateTelegramAuth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ initData: unsafeData }),
          });
          const data: AuthResponse = await response.json();
          setIsAuthenticated(data.success);
        } catch (error) {
          console.error('Failed to validate auth:', error);
          setIsAuthenticated(false);
        }
      }
    };

    validateAuth();
  }, [webApp, unsafeData]);

  return { isAuthenticated };
};
