import { TelegramProvider } from './shared/hooks/useTelegram';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './shared/utils/redux/store';
import { TonConnectUIProvider } from '@tonconnect/ui-react';

const queryClient = new QueryClient();
const manifestUrl = 'https://gist.github.com/ilyainavoid/efc7b93e7e9ec6e22a7564da4f07724a'

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
