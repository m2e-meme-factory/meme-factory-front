import { TelegramProvider } from './shared/hooks/useTelegram';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './shared/utils/redux/store';

const queryClient = new QueryClient();

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <TelegramProvider>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </Provider>
    </TelegramProvider>
  );
};

export default ProviderWrapper;
