import { PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@radix-ui/themes';

import NavigationMenu from './NavigationMenu';

import { isMobileDevice } from '@shared/utils/helpers/is-mobile-device';

const PageWrapper = (props: PropsWithChildren) => {
  const isMobile = isMobileDevice();
  return (
    <Box
      style={{
        marginTop: isMobile ? '10vh' : 'unset',
        display: 'flex',
        flexDirection: 'column',
        height: '100dvh',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          height: isMobile ? '80vh' : '90vh',
          overflowY: 'auto',
        }}
      >
        <Outlet />
      </Box>
      <NavigationMenu />
    </Box>
  );
};

export default PageWrapper;
