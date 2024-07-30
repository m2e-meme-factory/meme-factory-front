import { Box } from '@radix-ui/themes';
import { PropsWithChildren } from 'react';
import NavigationMenu from './NavigationMenu';
import {Outlet} from "react-router-dom";

const BasePageWrapper = (props: PropsWithChildren) => {
  return (
    <Box minHeight="100vh" style={{paddingBottom: "4.5em"}}>
        <Outlet/>
        <NavigationMenu />
    </Box>
  );
};



export default BasePageWrapper;