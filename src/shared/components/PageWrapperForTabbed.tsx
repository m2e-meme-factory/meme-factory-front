import { Box } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import NavigationMenu from './NavigationMenu';
import { Outlet } from 'react-router-dom';

const PageWrapperForTabbed = (props: PropsWithChildren) => {
  return (
    <Box minHeight='100vh' style={{ paddingBottom: '10vh' }}>
      <Outlet />
      <NavigationMenu />
    </Box>
  );
};

export default PageWrapperForTabbed;
