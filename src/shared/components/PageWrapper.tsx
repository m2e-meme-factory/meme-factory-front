import { Badge, Box, Callout } from '@radix-ui/themes';
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
      {/* <Box p="2" style={{textAlign: 'center'}}>5 <Badge color='yellow'>M2E XP</Badge></Box> */}
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
