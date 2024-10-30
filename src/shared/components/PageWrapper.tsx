import { Box } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import NavigationMenu from './NavigationMenu';
import { Outlet } from 'react-router-dom';

const PageWrapper = (props: PropsWithChildren) => {
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
