import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import { useTonConnectUI } from '@tonconnect/ui-react';
import { connectWallet } from '../../shared/utils/api/requests/ton/connect';
import WebappBackButton from '../../shared/components/WebappBackButton';

import {
  Grid,
  Text,
  Card,
  Badge,
  Heading,
  Flex,
  Button,
  Box,
  Tabs,
  Skeleton,
  AlertDialog,
} from '@radix-ui/themes';

import { RootState } from '../../shared/utils/redux/store';

import Loading from '../../shared/components/Loading';

import Swiper from 'swiper';
import 'swiper/css';
import styled from 'styled-components';
import GlowingButton from '../../shared/components/Buttons/GlowingButton';
import CoinbagAnimated from '../../shared/components/LottieIcons/Coinbag/CoinbagAnimated';
import Header from '../ProfilePage/Header';

const TransactionsHistoryPage = lazy(
  () => import('../TransactionsHistoryPage/TransactionsHistoryPage')
);

enum TabsOption {
  WALLET = 'wallet',
  TRANSACTIONS = 'transactions',
}

const TABS = [TabsOption.WALLET, TabsOption.TRANSACTIONS];

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

export default function WalletPage() {
  const [searchParams] = useSearchParams();
  const user = useSelector((state: RootState) => state.user.user);

  // const defaultTab = searchParams.get('tab') || 'wallet';
  // const action = searchParams.get('action');
  // const swiperRef = useRef<Swiper | null>(null);

  const [currentTab, setCurrentTab] = useState<TabsOption>(TabsOption.WALLET);

  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string>();

  // useEffect(() => {
  //   swiperRef.current = new Swiper('.swiper', {
  //     direction: 'horizontal',
  //   });

  //   if (swiperRef.current) {
  //     swiperRef.current.on('slideChange', () => {
  //       switch (swiperRef.current!.activeIndex) {
  //         case 0:
  //           setCurrentTab(TabsOption.WALLET);
  //           break;
  //         case 1:
  //           setCurrentTab(TabsOption.TRANSACTIONS);
  //           break;
  //       }
  //     });
  //   }

  //   return () => {
  //     if (swiperRef.current) {
  //       swiperRef.current.destroy(true, true);
  //     }
  //   };
  // }, []);

  // useEffect(() => {
  //   handleTabChange(defaultTab);
  // }, [defaultTab]);

  // const handleTabChange = (value: string) => {
  //   const newTab = value as TabsOption;
  //   if (swiperRef.current) {
  //     swiperRef.current.slideTo(TABS.indexOf(newTab));
  //   }
  // };

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

  useEffect(() => {
    const connect = async (wallet: string) => {
      await connectWallet({ params: { tonWalletAddress: wallet } });
    };

    if (walletAddress) {
      connect(walletAddress);
    }
  }, [walletAddress]);

  return (
    // <Tabs.Root defaultValue={defaultTab} value={currentTab} onValueChange={handleTabChange}>
    //   <Tabs.List justify='center' highContrast>
    //     <Tabs.Trigger value='wallet'>Wallet</Tabs.Trigger>
    //     <Tabs.Trigger value='transactions'>Transactions</Tabs.Trigger>
    //   </Tabs.List>

    //   <Box pt='3'>
    //     <SwiperContainer>
    //       <div className='swiper'>
    //         <div className='swiper-wrapper'>
    //           <div className='swiper-slide'>
    <>
    <Box p="4" pt="3">
      <Header />
    </Box>
      <Flex direction='column' justify='center' align='center' mt='8' m='4' gap='4'>
        <WebappBackButton />
        <CoinbagAnimated />

        <Heading align='center' size='8'>
          Connect Wallet
        </Heading>

        <Box asChild width='100%'>
          <Card mt='4'>
            <Grid gap='4'>
              <Flex direction='column'>
                <Heading>Available Balance</Heading>
                <Skeleton width='8' loading={!user}>
                  <Flex
                    gapX='3'
                    direction='row'
                    align='center'
                    style={{ width: 'fit-content', borderRadius: '5px' }}
                  >
                    <Text>{user?.balance ?? '0'}</Text> <Badge color='bronze'>M2E</Badge>
                  </Flex>
                </Skeleton>
              </Flex>
              {tonConnectUI.connected ? (
                <AlertDialog.Root>
                  <AlertDialog.Trigger>
                    <Button
                      size='4'
                      style={{
                        backgroundColor: 'var(--gray-6)',
                        color: 'var(--gray-11)',
                      }}
                    >
                      {'Connected: ' +
                        tonConnectUI.account?.address.slice(0, 3) +
                        '...' +
                        tonConnectUI.account?.address.slice(
                          tonConnectUI.account?.address.length - 3,
                          tonConnectUI.account?.address.length
                        ) || 'Disconnect'}
                    </Button>
                  </AlertDialog.Trigger>
                  <AlertDialog.Content maxWidth='450px'>
                    <AlertDialog.Title>Diconnect Wallet?</AlertDialog.Title>
                    <Flex gap='3' mt='4' justify='end'>
                      <AlertDialog.Cancel>
                        <Button variant='soft' color='gray'>
                          Cancel
                        </Button>
                      </AlertDialog.Cancel>
                      <AlertDialog.Action>
                        <Button
                          variant='solid'
                          color='red'
                          onClick={() => tonConnectUI.disconnect()}
                        >
                          Disconnect
                        </Button>
                      </AlertDialog.Action>
                    </Flex>
                  </AlertDialog.Content>
                </AlertDialog.Root>
              ) : (
                <GlowingButton size='4' onClick={() => tonConnectUI.modal.open()}>
                  Connect
                </GlowingButton>
              )}
            </Grid>
          </Card>
        </Box>
      </Flex>
    </>            
  //             </div>
  //             <div className='swiper-slide'>
  //               <Flex direction='column' justify='center'>
  //                 <Suspense
  //                   fallback={
  //                     <Flex justify='center' align='center' style={{ height: '100vh' }}>
  //                       <Loading />
  //                     </Flex>
  //                   }
  //                 >
  //                   <TransactionsHistoryPage />
  //                 </Suspense>
  //               </Flex>
  //             </div>
  //           </div>
  //         </div>
  //       </SwiperContainer>
  //     </Box>
  //   </Tabs.Root>
  );
}
