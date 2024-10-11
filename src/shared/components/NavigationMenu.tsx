import { Box, Button, Card, Flex, Separator, Text } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import { navigationRoutes } from '../consts/navigationRoutes';
import React from 'react';
import { HomeIcon } from '@radix-ui/react-icons';

const NavigationMenu = () => {
  const location = useLocation();

  return (
    <Box style={{ position: 'fixed', bottom: '0', width: '100%' }}>
      <Flex asChild width='100%' justify='center'>
        <Card style={{ background: 'var(--gray-1)' }}>
          <Flex gap='5' align='center' justify='center'>
            {navigationRoutes.map((route, key) => (
              <React.Fragment key={key}>
                <Link to={route.path}>
                  <Button
                    size='3'
                    variant={'ghost'}
                    color={location.pathname.includes(route.path) ? 'amber' : 'gray'}
                  >
                    <Flex direction='column' align='center' justify='center'>
                      {route.icon}
                      <Text size='1'>{route.title}</Text>
                    </Flex>
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
