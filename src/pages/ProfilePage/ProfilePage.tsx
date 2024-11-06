import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import {
  Grid,
  Text,
  Card,
  DataList,
  Heading,
  Flex,
  Box,
  Tabs,
  Skeleton,
  ScrollArea,
  Popover,
  IconButton,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';

import CopyableCode from '../../shared/components/CopyableCode';
import { AccentButton } from '../../shared/components/Buttons/GlowingButton';

import Swiper from 'swiper';
import 'swiper/css';
import styled from 'styled-components';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import DeveloperMenu from '../../shared/components/DevMenu/DeveloperMenu';
import useDeveloperMenu from '../../shared/hooks/useDeveloperMenu';

enum TabsOption {
  AIRDROP = 'airdrop',
  ACCOUNT = 'account',
}

const TABS = [TabsOption.AIRDROP, TabsOption.ACCOUNT];

const SwiperContainer = styled.div`
  .swiper {
    width: 100%;
    height: calc(100vh - 120px);
    z-index: 0;
  }

  .swiper-slide {
    overflow-y: auto;
    padding-bottom: 60px;
    z-index: 0;
  }

  .swiper-pagination {
    bottom: 10px !important;
  }

  .screen-without-tabs {
    height: calc(100vh - 40px);
  }
`;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'airdrop';
  const { data: userDataResponse, isLoading: userDataLoading } = useAuthMe();
  const navigate = useNavigate();

  const swiperRef = useRef<Swiper | null>(null);

  const [currentTab, setCurrentTab] = useState<TabsOption>(TabsOption.AIRDROP);
  const webapp = useWebApp();

  const handleBack = useCallback(() => {
    navigate(-1);
    webapp.BackButton.hide();
  }, [navigate, webapp]);

  useEffect(() => {
    webapp.ready();
    webapp.BackButton.show();
    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, webapp]);

  useEffect(() => {
    swiperRef.current = new Swiper('.swiper', {
      direction: 'horizontal',
    });

    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        switch (swiperRef.current!.activeIndex) {
          case 0:
            setCurrentTab(TabsOption.AIRDROP);
            break;
          case 1:
            setCurrentTab(TabsOption.ACCOUNT);
            break;
        }
      });
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, []);

  useEffect(() => {
    handleTabChange(defaultTab);
  }, [defaultTab]);

  const handleTabChange = (value: string) => {
    const newTab = value as TabsOption;
    if (swiperRef.current) {
      swiperRef.current.slideTo(TABS.indexOf(newTab));
    }
  };

  useEffect(() => {
    if (userDataResponse) {
      dispatch(setUser(userDataResponse));
    }
  }, [userDataResponse]);


  const { handleClick, menuVisible, setMenuVisible, clearTutorial, clearGuides } = useDeveloperMenu();
  
  return (
    <div style={{ height: '300px' }} onClick={handleClick}>
      {menuVisible && (
        <DeveloperMenu
          onClearTutorial={clearTutorial}
          onClearGuides={clearGuides}
          version={process.env.REACT_APP_VERSION || "none"}
        />
      )}
      <Tabs.Root
        defaultValue={defaultTab}
        value={currentTab}
        onValueChange={handleTabChange}
        style={{ height: '300px' }}
      >
        <Tabs.List justify='center' highContrast>
          <Tabs.Trigger value='airdrop'>Airdrop</Tabs.Trigger>
          <Tabs.Trigger value='account'>Account</Tabs.Trigger>
        </Tabs.List>

        <Box pt='3' style={{ maxHeight: '100%' }}>
          <SwiperContainer>
            <div className='swiper'>
              <div className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <Box m='4'>
                    <Flex direction='column' gap='5'>
                      <Flex justify='center' align='center' gap='2' direction='column'>
                        <Heading>
                          How to increase Airdrop chanceee?{' '}
                          <Popover.Root>
                            <Popover.Trigger>
                              <Flex align='center' display='inline-flex'>
                                <IconButton size='4' color='gray' variant='ghost' radius='full'>
                                  <InfoCircledIcon />
                                </IconButton>
                              </Flex>
                            </Popover.Trigger>
                            <Popover.Content size='1' maxWidth='300px'>
                              <Text size='2'>
                                <b>Airdrop</b> is gift in real tokens for active users
                              </Text>
                            </Popover.Content>
                          </Popover.Root>
                        </Heading>
                      </Flex>
                      <Flex direction='column' gap='2'>
                        <Link
                          style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                          to='/friends'
                        >
                          <Card>
                            <Flex justify='between' align='center' p='1'>
                              <Box>
                                <Box>Invite friends</Box>
                              </Box>
                              <Box>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  height='1.75rem'
                                  viewBox='0 0 256 256'
                                >
                                  <rect width='256' height='256' fill='none' />
                                  <path
                                    d='M192,120a59.91,59.91,0,0,1,48,24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <path
                                    d='M16,144a59.91,59.91,0,0,1,48-24'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <circle
                                    cx='128'
                                    cy='144'
                                    r='40'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <path
                                    d='M72,216a65,65,0,0,1,112,0'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <path
                                    d='M161,80a32,32,0,1,1,31,40'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <path
                                    d='M64,120A32,32,0,1,1,95,80'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                </svg>
                              </Box>
                            </Flex>
                          </Card>
                        </Link>

                        <Link
                          style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                          to='/wallet'
                        >
                          <Card>
                            <Flex justify='between' align='center' p='1'>
                              <Box>
                                <Box>Connect Wallet</Box>
                              </Box>
                              <Box>
                                <svg xmlns='http://www.w3.org/2000/svg' height='1.7rem' viewBox='0 0 256 256'>
                                  <rect width='256' height='256' fill='none' />
                                  <path
                                    d='M40,56V184a16,16,0,0,0,16,16H216a8,8,0,0,0,8-8V80a8,8,0,0,0-8-8H56A16,16,0,0,1,40,56h0A16,16,0,0,1,56,40H192'
                                    fill='none'
                                    stroke='currentColor'
                                    stroke-linecap='round'
                                    stroke-linejoin='round'
                                    stroke-width='16'
                                  />
                                  <circle cx='180' cy='132' r='12' />
                                </svg>
                              </Box>
                            </Flex>
                          </Card>
                        </Link>

                        
                        <Link
                          style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                          to='/projects/autotasks'
                        >
                          <Card>
                            <Flex justify='between' align='center' p='1'>
                              <Box>
                                <Box>Complete Fast Tasks</Box>
                              </Box>
                              <Box>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  height='1.75rem'
                                  fill='currentColor'
                                  viewBox='0 0 256 256'
                                >
                                  <path d='M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z'></path>
                                </svg>
                              </Box>
                            </Flex>
                          </Card>
                        </Link>

                        <Link
                          style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                          to='/projects'
                        >
                          <Card>
                            <Flex justify='between' align='center' p='1'>
                              <Box>
                                <Box>Complete Quests</Box>
                                <Box>
                                  <Text size='1' color='gray'>
                                    The most valuable type of activity
                                  </Text>
                                </Box>
                              </Box>
                              <Box>
                                <svg
                                  xmlns='http://www.w3.org/2000/svg'
                                  height='1.75rem'
                                  viewBox='0 0 256 256'
                                >
                                  <rect width='256' height='256' fill='none' />
                                  <ellipse
                                    cx='96'
                                    cy='84'
                                    rx='80'
                                    ry='36'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <path
                                    d='M16,84v40c0,19.88,35.82,36,80,36s80-16.12,80-36V84'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <line
                                    x1='64'
                                    y1='117'
                                    x2='64'
                                    y2='157'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <path
                                    d='M176,96.72c36.52,3.34,64,17.86,64,35.28,0,19.88-35.82,36-80,36-19.6,0-37.56-3.17-51.47-8.44'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <path
                                    d='M80,159.28V172c0,19.88,35.82,36,80,36s80-16.12,80-36V132'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <line
                                    x1='192'
                                    y1='165'
                                    x2='192'
                                    y2='205'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                  <line
                                    x1='128'
                                    y1='117'
                                    x2='128'
                                    y2='205'
                                    fill='none'
                                    stroke='currentColor'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth='16'
                                  />
                                </svg>
                              </Box>
                            </Flex>
                          </Card>
                        </Link>
                      </Flex>
                    </Flex>
                  </Box>
                </div>
                <div className='swiper-slide'>
                  <ScrollArea>
                    <Card m='4'>
                      <Grid gap='4'>
                        <Flex align='center'>
                          <Heading mr='3'>Profile</Heading>
                        </Flex>
                        <DataList.Root>
                          <DataList.Item>
                            <DataList.Label minWidth='88px'>ID</DataList.Label>
                            <Skeleton loading={userDataLoading}>
                              <DataList.Value>
                                <CopyableCode value={userDataResponse?.id || ''} />
                              </DataList.Value>
                            </Skeleton>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.Label minWidth='88px'>Nickname</DataList.Label>
                            <Skeleton loading={userDataLoading}>
                              <DataList.Value>
                                <CopyableCode value={`${userDataResponse?.username}`} />
                              </DataList.Value>
                            </Skeleton>
                          </DataList.Item>
                          <DataList.Item>
                            <DataList.Label minWidth='88px'>Type</DataList.Label>
                            <Skeleton loading={userDataLoading}>
                              <DataList.Value>
                                <Text>{userDataResponse?.role}</Text>
                              </DataList.Value>
                            </Skeleton>
                          </DataList.Item>
                        </DataList.Root>
                      </Grid>
                    </Card>

                    <Card m='4'>
                      <Grid gap='4'>
                        <Heading mr='3'>More</Heading>

                        <AccentButton onClick={() => navigate('/become-partner')} size='4'>
                          Become Advertiser
                        </AccentButton>
                      </Grid>
                    </Card>
                    <button
                      style={{ opacity: 0 }}
                      onClick={() => {
                        localStorage.setItem('onboardCompleted', 'false');
                      }}
                    >
                      tutorial
                    </button>
                  </ScrollArea>
                </div>
              </div>
            </div>
          </SwiperContainer>
        </Box>
      </Tabs.Root>
    </div>
  );
}
