import { Box, Button, Card, Flex, Separator } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import { navigationRoutes } from '../consts/navigationRoutes';
import React from 'react';

const NavigationMenu = () => {
  const location = useLocation();

  return (
    <Box style={{ position: 'fixed', bottom: '0', width: '100%' }}>
      <Flex asChild width='100%' justify='center'>
        <Card style={{ background: '#121212' }}>
          <Flex gap='3' align='center' justify='center'>
            {navigationRoutes.map((route, key) => (
              <React.Fragment key={key}>
                <Link to={route.path}>
                  <Button size='3' variant={location.pathname == route.path ? 'solid' : 'outline'}>
                    {route.title}
                  </Button>
                </Link>
                {key != navigationRoutes.length - 1 && (
                  <Separator size='2' orientation='vertical' />
                )}
              </React.Fragment>
            ))}
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
};

export default NavigationMenu;
