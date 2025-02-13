import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import { useLocation } from 'react-router-dom';
import mixpanel from 'mixpanel-browser';

import { useAuthMe } from '@shared/utils/api/hooks/auth/useAuthMe';
import { env } from '@shared/consts/env';
import { MIXPANEL_EVENT } from '@shared/consts/mixpanel-event';

interface MixPanelActionsType {
  trackEvent: (eventName: string, properties?: {}) => void;
}

const MixpanelContext = createContext<MixPanelActionsType | null>(null);

export const MixPanelProvider: FC<PropsWithChildren> = ({ children }) => {
  const { data: userDataResponse } = useAuthMe();
  const tokenMixpanel = env.tokenMixpanel;

  const telegramId = userDataResponse?.telegramId;
  const location = useLocation();

  useEffect(() => {
    if (telegramId) {
      mixpanel.init(`${tokenMixpanel}`, {});
      mixpanel.identify(telegramId);
    }
  }, [userDataResponse, tokenMixpanel, telegramId]);

  const trackEvent = useCallback(
    (eventName: string, properties = {}) => {
      if (telegramId && mixpanel.get_distinct_id()) {
        mixpanel.track(eventName, {
          ...properties,
          telegramId,
        });
      }
    },
    [telegramId]
  );

  useEffect(() => {
    trackEvent(MIXPANEL_EVENT.PAGE_VIEWED, { path: location.pathname });
  }, [location.pathname, trackEvent]);

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

