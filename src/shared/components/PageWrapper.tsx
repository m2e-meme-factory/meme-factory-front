import { Box } from '@radix-ui/themes';
import { PropsWithChildren, useEffect } from 'react';
import NavigationMenu from './NavigationMenu';
import { Outlet } from 'react-router-dom';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

const PageWrapper = (props: PropsWithChildren) => {
  const webApp = useWebApp();

  useEffect(() => {
    if (webApp) webApp?.enableClosingConfirmation();
  }, []);

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
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
  );
};

export default PageWrapper;
