import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@radix-ui/themes';

import NavigationMenu from './NavigationMenu';
import WebappBackButton from './WebappBackButton';

import { MixPanelProvider } from '@providers/provider-mixpanel';

const PageWrapper = (props: PropsWithChildren) => {
  return (
    <MixPanelProvider>
      <WebappBackButton />
      <Box
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100dvh',
          overflow: 'hidden',
        }}
      >
        <Box
          style={{
            height: '90vh',
            overflowY: 'auto',
          }}
        >
          <Outlet />
        </Box>
        <NavigationMenu />
      </Box>
    </MixPanelProvider>
  );
};

export default PageWrapper;
