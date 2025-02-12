import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import mixpanel from 'mixpanel-browser';

import { useAuthMe } from '@shared/utils/api/hooks/auth/useAuthMe';
import { env } from '@shared/consts/env';

interface MixPanelActionsType {
  trackEvent: (eventName: string, properties?: {}) => void;
}

const MixpanelContext = createContext<MixPanelActionsType | null>(null);

export const MixPanelProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: userDataResponse } = useAuthMe();
  const tokenMixpanel = env.tokenMixpanel;

  const telegramId = userDataResponse?.telegramId;

  useEffect(() => {
    if (telegramId) {
      mixpanel.init(`${tokenMixpanel}`, {});
      mixpanel.identify(telegramId);
    }
  }, [userDataResponse, tokenMixpanel, telegramId]);

  const trackEvent = useCallback(
    (eventName: string, properties = {}) => {
      if (mixpanel) {
        mixpanel.track(eventName, {
          ...properties,
          telegramId,
        });
      }
    },
    [telegramId]
  );

  const actions = useMemo(() => {
    return {
      trackEvent,
    };
  }, [trackEvent]);

  return <MixpanelContext.Provider value={actions}>{children}</MixpanelContext.Provider>;
};

export const useMixpanelContext = () => {
  const context = useContext(MixpanelContext);
  if (!context) {
    throw new Error('useMixpanel must be used within a MixpanelProvider');
  }
  return context;
};

