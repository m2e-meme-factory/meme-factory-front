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
} from '@radix-ui/themes';
import CopyableCode from '../../shared/components/CopyableCode';
import { ChevronRightIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import { useDispatch, useSelector } from 'react-redux';
import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { RefDataResponse, User } from 'api';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { RootState } from '../../shared/utils/redux/store';
import { connectWallet } from '../../shared/utils/api/requests/ton/connect';
import { Sheet } from 'react-modal-sheet';
import verified from './../../shared/imgs/verify.png';
import GlowingButton from '../../shared/components/Buttons/GlowingButton';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { verifyUser } from '../../shared/utils/api/requests/user/verifyUser';
import { showErrorMessage, showSuccessMessage } from '../../shared/utils/helpers/notify';
import { useSwipeable } from 'react-swipeable';
import Swiper from 'swiper';
import 'swiper/css';
import styled from 'styled-components';
import Loading from '../../shared/components/Loading';

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
  const [userSt, setUserSt] = useState<User>();
  const { data: userDataResponse } = useAuthMe();
  const [refData, setRefData] = useState<RefDataResponse | null>(null);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';
  const [isModalVisible, setModalVisible] = useState(false);

  const [walletAddress, setWalletAddress] = useState<string>();
  const user = useSelector((state: RootState) => state.user.user);
  const [tonConnectUI] = useTonConnectUI();
  const navigate = useNavigate();
  const swiperRef = useRef<Swiper | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [[page, direction], setPage] = useState([0, 0]);
  const [currentTab, setCurrentTab] = useState<TabsOption>(TabsOption.ACCOUNT);

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleTabChange(TabsOption.TRANSACTIONS),
    onSwipedRight: () => handleTabChange(TabsOption.ACCOUNT),
    trackMouse: true,
  });

  useEffect(() => {
    swiperRef.current = new Swiper('.swiper', {
      direction: 'horizontal',
    });

    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        setCurrentSlideIndex(swiperRef.current!.activeIndex);
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
      setUserSt(userDataResponse.data);
      dispatch(setUser(userDataResponse.data));
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
                      <Text>
                        {userSt?.balance ?? '0'} <Badge color='bronze'>M2E</Badge>
                      </Text>
                    </Flex>
                    <Button>
                      <ChevronRightIcon /> Withdraw
                    </Button>
                  </Flex>
                </Card>

                {userSt && !userSt.isVerified && (
                  <Card m='4'>
                    <Grid gap='4'>
                      <Heading>Verify</Heading>
                      <Callout.Root>
                        <Callout.Icon>
                          <InfoCircledIcon height={20} width={20} />
                        </Callout.Icon>
                        <Callout.Text>
                          {/* <Text color='gray' mb='2' size='2'> */}
                          Verified users have auto approve for any project apply and have 100%
                          chance for receiving airdrop. Instant verification price: 5 USDT
                          {/* </Text> */}
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
                        <DataList.Value>
                          <Badge
                            color={userSt?.isVerified ? 'jade' : 'red'}
                            variant='soft'
                            radius='full'
                          >
                            {userSt?.isVerified ? 'Verified' : 'Not Verified'}
                          </Badge>
                        </DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth='88px'>ID</DataList.Label>
                        <DataList.Value>
                          <CopyableCode value={userSt?.id || ''} />
                        </DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth='88px'>Nickname</DataList.Label>
                        <DataList.Value>
                          <CopyableCode value={`${userSt?.username}`} />
                        </DataList.Value>
                      </DataList.Item>
                      <DataList.Item>
                        <DataList.Label minWidth='88px'>Type</DataList.Label>
                        <DataList.Value>{userSt?.role}</DataList.Value>
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
                        navigate('/');
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
