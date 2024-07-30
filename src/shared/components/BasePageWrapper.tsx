import { Box } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import NavigationMenu from './NavigationMenu';

const BasePageWrapper = (props: PropsWithChildren) => {
  return (
    <Box minHeight="100vh" style={{paddingBottom: "4.5em"}}>
        {props.children}
        <NavigationMenu />
    </Box>
  );
};



export default BasePageWrapper;