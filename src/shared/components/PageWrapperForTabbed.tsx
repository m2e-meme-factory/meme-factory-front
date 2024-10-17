import { Box } from '@radix-ui/themes';
import { PropsWithChildren, useEffect } from 'react';
import NavigationMenu from './NavigationMenu';
import { Outlet } from 'react-router-dom';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

const PageWrapperForTabbed = (props: PropsWithChildren) => {
  const webApp = useWebApp();

  useEffect(() => {
    if (webApp) webApp?.enableClosingConfirmation();
  }, []);

  return (
    <Box minHeight='100vh' style={{ paddingBottom: '10vh' }}>
      <Outlet />
      <NavigationMenu />
    </Box>
  );
};

export default PageWrapperForTabbed;
