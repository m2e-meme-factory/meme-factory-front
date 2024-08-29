import { TelegramProvider } from './shared/hooks/useTelegram';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './shared/utils/redux/store';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const queryClient = new QueryClient();
const manifestUrl = 'https://api.meme-factory.site/uploads/files/3477b352-6cf7-4967-9b1f-fe96fc925753_tonconnect-manifest.json';

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <TonConnectUIProvider manifestUrl={manifestUrl}>
      <TelegramProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
        </Provider>
      </TelegramProvider>
    </TonConnectUIProvider>
  );
};

export default ProviderWrapper;
