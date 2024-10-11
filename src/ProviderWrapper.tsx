import { TelegramProvider } from './shared/hooks/useTelegram';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React, { ReactNode } from 'react';
import { Provider } from 'react-redux';
import { store } from './shared/utils/redux/store';
import { THEME, TonConnectUI, TonConnectUIProvider } from '@tonconnect/ui-react';
import { WebAppProvider } from '@vkruglikov/react-telegram-web-app';

const queryClient = new QueryClient();
const manifestUrl =
  'https://api.meme-factory.site/uploads/files/3477b352-6cf7-4967-9b1f-fe96fc925753_tonconnect-manifest.json';

// const tonConnectUI = new TonConnectUI({
//   manifestUrl,
//   uiPreferences: {
//     theme: THEME.DARK,
//     borderRadius: "s",
//     colorsSet: {
//       DARK: {
//         connectButton: {
//           background: '#29CC6A'
//         }
//       },
//     }
//   }
// });

const ProviderWrapper = ({ children }: { children: ReactNode }) => {
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
