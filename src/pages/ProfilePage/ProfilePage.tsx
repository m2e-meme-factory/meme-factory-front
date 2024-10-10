import React, { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
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
} from '@radix-ui/themes';
import { ChevronRightIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';

import { RootState } from '../../shared/utils/redux/store';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import { connectWallet } from '../../shared/utils/api/requests/ton/connect';
import { verifyUser } from '../../shared/utils/api/requests/user/verifyUser';
import { showErrorMessage, showSuccessMessage } from '../../shared/utils/helpers/notify';

import Loading from '../../shared/components/Loading';
import CopyableCode from '../../shared/components/CopyableCode';
import GlowingButton from '../../shared/components/Buttons/GlowingButton';

import verified from './../../shared/imgs/verify.png';
import Swiper from 'swiper';
import 'swiper/css';
import styled from 'styled-components';
import { Sheet } from 'react-modal-sheet';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

const TransactionsHistoryPage = lazy(
  () => import('../TransactionsHistoryPage/TransactionsHistoryPage')
);

enum TabsOption {
  ACCOUNT = 'account',
  TRANSACTIONS = 'transactions',
}

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
  const [tonConnectUI] = useTonConnectUI();
  const user = useSelector((state: RootState) => state.user.user);
  const navigate = useNavigate();

  const defaultTab = searchParams.get('tab') || 'account';
  const swiperRef = useRef<Swiper | null>(null);

  const [isModalVisible, setModalVisible] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>();
  const [[page, direction], setPage] = useState([0, 0]);
  const [currentTab, setCurrentTab] = useState<TabsOption>(TabsOption.ACCOUNT);

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
        setCurrentTab(
          swiperRef.current!.activeIndex === 0 ? TabsOption.ACCOUNT : TabsOption.TRANSACTIONS
        );
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
    setPage([
      page + (newTab === TabsOption.ACCOUNT ? -1 : 1),
      newTab === TabsOption.ACCOUNT ? -1 : 1,
    ]);
    if (swiperRef.current) {
      swiperRef.current.slideTo(newTab === TabsOption.ACCOUNT ? 0 : 1);
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

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        setWalletAddress(wallet.account.address);
      } else {
        setWalletAddress('');
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI]);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  useEffect(() => {
    const connect = async (wallet: string) => {
      await connectWallet({ params: { tonWalletAddress: wallet } });
    };

    if (walletAddress) {
      connect(walletAddress);
    }
  }, [walletAddress]);

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
        <Tabs.Trigger value='account'>Account</Tabs.Trigger>
        <Tabs.Trigger value='transactions'>Transactions</Tabs.Trigger>
      </Tabs.List>

      <Box pt='3'>
        <SwiperContainer>
          <div className='swiper'>
            <div className='swiper-wrapper'>
              <div className='swiper-slide'>
                <Card m='4'>
                  <Flex align='center' justify='between'>
                    <Heading size='4' mr='6'>
                      Connect TON Wallet
                    </Heading>
                    <TonConnectButton />
                  </Flex>
                </Card>

                <Card m='4'>
                  <Flex justify='between' align='center'>
                    <Flex direction='column'>
                      <Heading>Available Balance</Heading>
                      <Skeleton width='4' loading={userDataLoading}>
                        <Flex
                          gapX='3'
                          direction='row'
                          align='center'
                          style={{ width: 'fit-content', borderRadius: '5px' }}
                        >
                          <Text>{userDataResponse?.balance ?? '0'}</Text>{' '}
                          <Badge color='bronze'>M2E</Badge>
                        </Flex>
                      </Skeleton>
                    </Flex>
                  </Flex>
                </Card>

                {userDataResponse && !userDataResponse.isVerified && (
                  <Card m='4'>
                    <Grid gap='4'>
                      <Heading>Verify</Heading>
                      <Callout.Root>
                        <Callout.Icon>
                          <InfoCircledIcon height={20} width={20} />
                        </Callout.Icon>
                        <Callout.Text>
                          Verified users have auto approve for any project apply and have 100%
                          chance for receiving airdrop. Instant verification price: 5 USDT
                        </Callout.Text>
                      </Callout.Root>
                      <GlowingButton size='3' onClick={handleDialogOpen}>
                        Verify
                      </GlowingButton>

                      <Sheet
                        isOpen={isModalVisible}
                        onClose={() => handleDialogClose()}
                        detent='content-height'
                      >
                        <Sheet.Container style={{ overflowY: 'auto' }}>
                          <Sheet.Header />
                          <Sheet.Content>
                            <Sheet.Scroller>
                              <Theme>
                                <Grid gap='8' m='4' mb='5' align='center'>
                                  <Flex justify='center'>
                                    <img width='80%' src={verified} alt='Verified icon' />
                                  </Flex>
                                  <Grid gap='2'>
                                    <Heading mb='2'>Benefits of verified accounts 🔥</Heading>
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
                            </Sheet.Scroller>
                          </Sheet.Content>
                        </Sheet.Container>
                        <Sheet.Backdrop onTap={() => handleDialogClose()} />
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
                    <Heading>Tutorial</Heading>
                    <Button
                      onClick={() => {
                        localStorage.setItem('onboardCompleted', 'false');
                        navigate('/tutorial');
                      }}
                    >
                      Start tutorial again
                    </Button>
                  </Grid>
                </Card>
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
