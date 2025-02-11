import { ReactNode, useEffect } from 'react';
import './with-i18n';
import { Provider } from 'react-redux';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useExpand, useWebApp, WebAppProvider } from '@vkruglikov/react-telegram-web-app';

import { store } from '@shared/utils/redux/store';
import { env } from '@shared/consts/env';

const queryClient = new QueryClient();
const manifestUrl = `${env.baseUrl}/uploads/files/3477b352-6cf7-4967-9b1f-fe96fc925753_tonconnect-manifest.json`;

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [isExpanded, expand] = useExpand();
  const WebApp = useWebApp();

  useEffect(() => {
    expand();
    try {
      WebApp.requestFullscreen();
    } catch (err) {}
    WebApp.setBottomBarColor('#000');
    WebApp.setBackgroundColor('#000');
    WebApp.setHeaderColor('#000');
    WebApp.disableVerticalSwipes();
    WebApp.enableClosingConfirmation();
  }, []);

  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <WebAppProvider
        options={{
          smoothButtonsTransition: true,
        }}
      >
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
      </WebAppProvider>
    </TonConnectUIProvider>
  );
};

export default ProviderWrapper;
