import { Box } from '@radix-ui/themes';
import { PropsWithChildren, useEffect } from 'react';
import NavigationMenu from './NavigationMenu';
import { Outlet } from 'react-router-dom';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useTelegram } from '../hooks/useTelegram';

const BasePageWrapper = (props: PropsWithChildren) => {
  const webApp = useWebApp()

  useEffect(() => {
    // webApp.ready();
    if (webApp)
      webApp?.enableClosingConfirmation()
  }, [])

  return (
    <Box minHeight='100vh' style={{ paddingBottom: '4.5em' }}>
      <Outlet />
      <NavigationMenu />
    </Box>
  );
};

export default BasePageWrapper;
