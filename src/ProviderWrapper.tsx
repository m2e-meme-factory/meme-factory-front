import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode, useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from './shared/utils/redux/store';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { useExpand, useWebApp, WebAppProvider } from '@vkruglikov/react-telegram-web-app';

const queryClient = new QueryClient();
const manifestUrl =
  'https://api.meme-factory.site/uploads/files/3477b352-6cf7-4967-9b1f-fe96fc925753_tonconnect-manifest.json';

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  const [isExpanded, expand] = useExpand();
  const WebApp = useWebApp();

  useEffect(() => {
    expand();
    WebApp.setBottomBarColor('#121212');
    WebApp.setBackgroundColor('#121212');
    WebApp.setHeaderColor('#121212');
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
