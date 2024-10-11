import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  Grid,
  Text,
  Card,
  DataList,
  Badge,
  Heading,
  Flex,
  Button,
  Box,
  Tabs,
  Theme,
  Callout,
  Blockquote,
  Skeleton,
  ScrollArea,
  Code,
  Popover,
  IconButton,
  TextArea,
  AlertDialog,
} from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';

import { RootState } from '../../shared/utils/redux/store';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import { verifyUser } from '../../shared/utils/api/requests/user/verifyUser';
import { showErrorMessage, showSuccessMessage } from '../../shared/utils/helpers/notify';

import Loading from '../../shared/components/Loading';
import CopyableCode from '../../shared/components/CopyableCode';
import GlowingButton, { AccentButton } from '../../shared/components/Buttons/GlowingButton';

import star from './../../shared/imgs/star.webp';

import Swiper from 'swiper';
import 'swiper/css';
import styled from 'styled-components';
import { Sheet } from 'react-modal-sheet';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import tsssEmoji from '../../shared/imgs/tsssEmoji.png';
import yeyEmoji from '../../shared/imgs/yey.png';
import { ResponsibleImage } from '../../shared/components/ResponsibleImage';
import toast from 'react-hot-toast';

const TransactionsHistoryPage = lazy(
  () => import('../TransactionsHistoryPage/TransactionsHistoryPage')
);

enum TabsOption {
  AIRDROP = 'airdrop',
  ACCOUNT = 'account',
  TRANSACTIONS = 'transactions',
}

const TABS = [TabsOption.AIRDROP, TabsOption.ACCOUNT, TabsOption.TRANSACTIONS];

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
`;

export default function ProfilePage() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const { data: userDataResponse, isLoading: userDataLoading } = useAuthMe();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const defaultTab = searchParams.get('tab') || 'airdrop';
  const action = searchParams.get('action');
  const swiperRef = useRef<Swiper | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
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
          case 2:
            setCurrentTab(TabsOption.TRANSACTIONS);
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

  useEffect(() => {
    if (action === 'verify') {
      setTimeout(() => handleDialogOpen(), 300);
    }
  }, [action]);

  const handleTabChange = (value: string) => {
    const newTab = value as TabsOption;
    if (swiperRef.current) {
      swiperRef.current.slideTo(TABS.indexOf(newTab));
    }
  };

  const { mutate: verify } = useMutation({
    mutationFn: verifyUser,
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
    onSuccess: () => showSuccessMessage('Verified successfully'),
    onError: () => showErrorMessage('Error occurred'),
  });

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleVerify = () => {
    if (user) {
      handleDialogClose();
      verify({ params: { telegramId: user.telegramId } });
    }
  };

  useEffect(() => {
    if (userDataResponse) {
      dispatch(setUser(userDataResponse));
    }
  }, [userDataResponse]);

  return (
    <Tabs.Root defaultValue={defaultTab} value={currentTab} onValueChange={handleTabChange}>
      <Tabs.List justify='center' highContrast>
        <Tabs.Trigger value='airdrop'>Airdrop</Tabs.Trigger>
        <Tabs.Trigger value='account'>Account</Tabs.Trigger>
        <Tabs.Trigger value='transactions'>Transactions</Tabs.Trigger>
      </Tabs.List>

      <Box pt='3'>
        <SwiperContainer>
          <div className='swiper'>
            <div className='swiper-wrapper'>
              <div className='swiper-slide'>
                <Box m="4">
                  <Flex direction="column" gap="5">

                    <Flex justify='center' align='center' gap='2' direction='column'>
                      <Heading>
                        How to increase Airdrop chance?{' '}
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
                    <Flex direction="column" gap="2">
                    <Link style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }} to="/friends">
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
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <path
                                d='M16,144a59.91,59.91,0,0,1,48-24'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <circle
                                cx='128'
                                cy='144'
                                r='40'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <path
                                d='M72,216a65,65,0,0,1,112,0'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <path
                                d='M161,80a32,32,0,1,1,31,40'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <path
                                d='M64,120A32,32,0,1,1,95,80'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                            </svg>
                          </Box>
                        </Flex>
                      </Card>
                      </Link>

                      <Link style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }} to="/projects/autotasks">
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
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <path
                                d='M16,84v40c0,19.88,35.82,36,80,36s80-16.12,80-36V84'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <line
                                x1='64'
                                y1='117'
                                x2='64'
                                y2='157'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <path
                                d='M176,96.72c36.52,3.34,64,17.86,64,35.28,0,19.88-35.82,36-80,36-19.6,0-37.56-3.17-51.47-8.44'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <path
                                d='M80,159.28V172c0,19.88,35.82,36,80,36s80-16.12,80-36V132'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <line
                                x1='192'
                                y1='165'
                                x2='192'
                                y2='205'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                              <line
                                x1='128'
                                y1='117'
                                x2='128'
                                y2='205'
                                fill='none'
                                stroke='currentColor'
                                stroke-linecap='round'
                                stroke-linejoin='round'
                                stroke-width='16'
                              />
                            </svg>
                          </Box>
                        </Flex>
                      </Card>
                    </Flex>

                    <Skeleton loading={userDataLoading}>
                      <Heading>
                        <Flex align='center' display='inline-flex'>
                          <img
                            height='30rem'
                            style={{ transform: 'translateY(5px)' }}
                            src={userDataResponse?.isVerified ? yeyEmoji : tsssEmoji}
                            alt=''
                          />
                        </Flex>{' '}
                        {userDataResponse?.isVerified ? (
                          <>
                            Congrats!
                            <br />
                            Your airdrop is 100% guaranteed!
                          </>
                        ) : (
                          'Want a 100% chance to claim the airdrop?'
                        )}
                      </Heading>
                    </Skeleton>

                    <Skeleton loading={userDataLoading}>
                      {userDataResponse?.isVerified ? (
                        <Button size='4' disabled={true}>
                          You are verified
                        </Button>
                      ) : (
                        <GlowingButton size='4' onClick={handleDialogOpen}>
                          Verify Now!
                        </GlowingButton>
                      )}
                    </Skeleton>
                  </Flex>
                </Box>
              </div>
              <div className='swiper-slide'>
                <ScrollArea>
                  {!userDataLoading && !userDataResponse?.isVerified && (
                    <Card m='4'>
                      <Grid gap='4'>
                        <Heading>Verify</Heading>
                        <Callout.Root>
                          <Callout.Icon>
                            <InfoCircledIcon height={20} width={20} />
                          </Callout.Icon>
                          <Callout.Text>
                            Verified users have auto approve for any project apply and have 100%
                            chance for receiving airdrop. <br />
                            <br />
                            Instant verification price: <br /> <Code>5 USDT</Code>
                          </Callout.Text>
                        </Callout.Root>
                        <GlowingButton size='4' onClick={handleDialogOpen}>
                          Verify
                        </GlowingButton>

                        <Sheet
                          isOpen={isModalVisible}
                          onClose={() => handleDialogClose()}
                          detent='content-height'
                        >
                          <Theme appearance='dark'>
                            <Sheet.Container style={{ overflowY: 'auto', background: '#121113' }}>
                              <Sheet.Header />
                              <Sheet.Content>
                                <Theme>
                                  <Grid gap='8' m='4' mb='5' align='center'>
                                    <Flex justify='center'>
                                      <ResponsibleImage src={star} />
                                    </Flex>
                                    <Grid gap='2'>
                                      <Heading mb='2' align='center'>
                                        Benefits of verified accounts
                                      </Heading>
                                      <Blockquote>100% chance for Airdrop claim</Blockquote>
                                      <Blockquote>Auto approve to any project</Blockquote>
                                      <Blockquote>
                                        High priority for checking task completion
                                      </Blockquote>
                                    </Grid>

                                    <GlowingButton
                                      size='4'
                                      onClick={handleVerify}
                                      style={{ width: '100%' }}
                                    >
                                      Verify Now
                                    </GlowingButton>
                                  </Grid>
                                </Theme>
                              </Sheet.Content>
                            </Sheet.Container>
                            <Sheet.Backdrop onTap={() => handleDialogClose()} />
                          </Theme>
                        </Sheet>
                      </Grid>
                    </Card>
                  )}

                  <Card m='4'>
                    <Grid gap='4'>
                      <Flex align='center'>
                        <Heading mr='3'>Profile</Heading>
                      </Flex>
                      <DataList.Root>
                        <DataList.Item align='center'>
                          <DataList.Label minWidth='88px'>Status</DataList.Label>
                          <Skeleton loading={userDataLoading}>
                            <DataList.Value>
                              <Badge
                                color={userDataResponse?.isVerified ? 'jade' : 'red'}
                                variant='soft'
                                radius='full'
                              >
                                {userDataResponse?.isVerified ? 'Verified' : 'Not Verified'}
                              </Badge>
                            </DataList.Value>
                          </Skeleton>
                        </DataList.Item>
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
                      <AlertDialog.Root>
                        <AlertDialog.Trigger>
                          <AccentButton size='4'>Become Advertiser</AccentButton>
                        </AlertDialog.Trigger>
                        <AlertDialog.Content>
                          <AlertDialog.Title>Become Partner</AlertDialog.Title>
                          <AlertDialog.Description>
                            Give us some information about your project
                            <TextArea style={{ minHeight: '100px' }} mt='4'></TextArea>
                          </AlertDialog.Description>
                          <Flex gap='3' mt='4' justify='end'>
                            <AlertDialog.Cancel>
                              <Button variant='soft' color='gray'>
                                Cancel
                              </Button>
                            </AlertDialog.Cancel>
                            <AlertDialog.Action>
                              <AccentButton
                                onClick={() => {
                                  toast.success('Send Advertiser Apply', {
                                    style: {
                                      borderRadius: '10px',
                                      background: '#333',
                                      color: '#fff',
                                    },
                                  });
                                }}
                              >
                                Become Advertiser
                              </AccentButton>
                            </AlertDialog.Action>
                          </Flex>
                        </AlertDialog.Content>
                      </AlertDialog.Root>
                    </Grid>
                  </Card>
                </ScrollArea>
              </div>
              <div className='swiper-slide'>
                <Flex direction='column' justify='center'>
                  <Suspense
                    fallback={
                      <Flex justify='center' align='center' style={{ height: '100vh' }}>
                        <Loading />
                      </Flex>
                    }
                  >
                    <TransactionsHistoryPage />
                  </Suspense>
                </Flex>
              </div>
            </div>
          </div>
        </SwiperContainer>
      </Box>
    </Tabs.Root>
  );
}
