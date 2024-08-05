import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { ITelegramUser, IWebApp } from '../../@types/app';

export interface ITelegramContext {
  webApp?: IWebApp;
  user?: ITelegramUser;
  unsafeData?: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
}

export const TelegramContext = createContext<ITelegramContext>({});

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [webApp, setWebApp] = useState<IWebApp | null>(null);

  useEffect(() => {
    const app = (window as any).Telegram?.WebApp;
    if (app) {
      app.ready();
      setWebApp(app);
    }
  }, []);

  const value = useMemo(() => {
    return webApp
      ? {
        webApp,
        unsafeData: webApp.initDataUnsafe as {
          query_id: string;
          user: ITelegramUser;
          auth_date: string;
          hash: string;
        },
        user: webApp.initDataUnsafe?.user,
      }
      : {};
  }, [webApp]);

  return (
    <TelegramContext.Provider value={value}>
      {webApp ? children : null}
    </TelegramContext.Provider>
  );
};

export const useTelegram = () => useContext(TelegramContext);
