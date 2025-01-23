import { Box, Button, Card, Flex, Separator, Text } from '@radix-ui/themes';
import { Link, useLocation } from 'react-router-dom';
import { navigationRoutes } from '../consts/navigationRoutes';
import React from 'react';
import GlowingButton from './Buttons/GlowingButton';

const NavigationMenu = () => {
  const location = useLocation();

  return (
    <Box style={{ position: 'fixed', bottom: '0', width: '100%', height: '10vh', borderRadius: '0' }}>
      <Flex asChild width='100%' justify='center'>
        <Card className='navigation-menu' style={{  height: '100%', paddingLeft: '5vw', paddingRight: '5vw' }}>
          <Flex gap='4' align='center' justify='between' >
            {navigationRoutes.map((route, key) => (
              <React.Fragment key={key}>
                <Link to={route.path}>
                {
                  (route.isMain && location.pathname != route.path) ? (
                    <GlowingButton variant='ghost' size="3" style={{color: 'var(--gray-3)'}}>
                      <Flex direction='column' align='center' justify='center'>
                        {route.icon}
                        <Text size='1'>{route.title}</Text>
                      </Flex>
                    </GlowingButton>
                  ) : (
                    <Button
                      size='3'
                      variant={'ghost'}
                      style={{background: 'transparent'}}
                      color={location.pathname === route.path ? 'amber' : 'gray'} // Изменено здесь
                    >
                      <Flex direction='column' align='center' justify='center'>
                        {route.icon}
                        <Text size='1'>{route.title}</Text>
                      </Flex>
                    </Button>
                  )
                }
                </Link>
                {/* {key !== navigationRoutes.length - 1 && (
                  <Separator size='2' orientation='vertical' />
                )} */}
              </React.Fragment>
            ))}
          </Flex>
        </Card>
      </Flex>
    </Box>
  );
};

export default NavigationMenu;
