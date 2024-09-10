import {
  Grid,
  Text,
  Card,
  DataList,
  Badge,
  Heading,
  Spinner,
  Flex,
  Button,
  IconButton,
  Box,
  Tabs,
  Dialog,
  Theme,
  Callout,
  Blockquote,
} from '@radix-ui/themes';
import CopyableCode from '../../shared/components/CopyableCode';
import CopyableTextField from '../../shared/components/CopyableTextField';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { ChevronRightIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import styles from './ProfilePage.module.css';
import MyProjectsPage from '../MyProjectsPage/MyProjectsPage';
import TransactionsHistoryPage from '../TransactionsHistoryPage/TransactionsHistoryPage';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { RefDataResponse, User } from 'api';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import { useSearchParams } from 'react-router-dom';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { RootState } from '../../shared/utils/redux/store';
import { useVerifyUser } from '../../shared/utils/api/hooks/user/useVerifyUser';
import { connectWallet } from '../../shared/utils/api/requests/ton/connect';
import { Sheet } from 'react-modal-sheet';
import verified from './../../shared/imgs/verify.png';
import { List } from '@radix-ui/react-tabs';
import styled from 'styled-components';

const GlowingBtn = styled(Button)`
  background: linear-gradient(180deg, var(--brand-color) 0%, var(--brand-color) 100%);
  box-shadow: 0px 0px 20px 0px var(--brand-color);
  animation: glow 3s ease-in-out infinite alternate;

@keyframes glow {
  0% {
    box-shadow: 0px 0px 20px 0px var(--brand-color);
  }

  50% {
    box-shadow: 0px 0px 20px -20px var(--brand-color);
  }

  100% {
    box-shadow: 0px 0px 20px 0px var(--brand-color);
  }
}

  &:hover {
    box-shadow: 0px 0px 20px 0px var(--brand-color);
  }
`

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [userSt, setUserSt] = useState<User>();
  const { data: userDataResponse } = useAuthMe();
  const [refData, setRefData] = useState<RefDataResponse | null>(null);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';
  const [isModalVisible, setModalVisible] = useState(false);

  const [walletAddress, setWalletAddress] = useState<string>();
  const user = useSelector((state: RootState) => state.user.user);
  const [tonConnectUI] = useTonConnectUI();

  const verifyMutation = useVerifyUser();

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
      console.log(walletAddress);
      connect(walletAddress);
    }
  }, [walletAddress]);

  const handleVerify = () => {
    if (user) {
      handleDialogClose();
      verifyMutation.mutate({ params: { telegramId: user.telegramId } });
    }
  };

  useEffect(() => {
    if (userDataResponse) {
      setUserSt(userDataResponse.data);
      dispatch(setUser(userDataResponse.data));
    }
  }, [userDataResponse]);

  const { data, isLoading: refLoading } = useGetRefData(userSt?.telegramId);

  useEffect(() => {
    if (data) {
      setRefData(data.data);
    }
  }, [data]);

  if (refLoading) {
    return (
      <Flex className={styles.LoadingContainer} align='center' justify='center'>
        <Spinner size='3' />
      </Flex>
    );
  }

  const refCount = refData?.count;

  return (
    <Tabs.Root defaultValue={defaultTab}>
      <Tabs.List justify='center' highContrast>
        <Tabs.Trigger value='account'>Account</Tabs.Trigger>
        <Tabs.Trigger value='transactions'>Transactions</Tabs.Trigger>
        <Tabs.Trigger value='myprojects'>My Projects</Tabs.Trigger>
      </Tabs.List>

      <Box pt='3'>
        <Tabs.Content value='account'>
          <Card m='4'>
            <Grid gap='4'>
              <Flex align='center'>
                <Heading mr='3'>Profile</Heading>
              </Flex>
              <DataList.Root>
                <DataList.Item align='center'>
                  <DataList.Label minWidth='88px'>Status</DataList.Label>
                  <DataList.Value>
                    <Badge color={userSt?.isVerified ? 'jade' : 'red'} variant='soft' radius='full'>
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
            <Flex justify='between' align='center'>
              <Flex direction='column'>
                <Text mb='2' color='gray'>
                  Available Balance
                </Text>
                <Heading>{userSt?.balance ?? '0'} <Badge color='bronze'>M2E</Badge></Heading>
              </Flex>
              <Button>
                <ChevronRightIcon /> Withdraw
              </Button>
            </Flex>
          </Card>

          <Card m='4'>
            <Grid gap='4'>
              <Heading>Referas</Heading>
              <Text color='gray'>Your Ref link:</Text>
              <CopyableTextField size={'2'} fieldSize='3' value={refData?.refLink || ' '} />
              <DataList.Root mt='4'>
                <DataList.Item align='center'>
                  <DataList.Item>
                    <DataList.Label minWidth='88px'>Total Count</DataList.Label>
                    <DataList.Value>{refCount}</DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth='88px'>Total profit</DataList.Label>
                    <DataList.Value>0 M2E</DataList.Value>
                  </DataList.Item>
                </DataList.Item>
              </DataList.Root>
            </Grid>
          </Card>

          {/* <Card m='4'>
            <Heading mb='3'>Socials</Heading>
            <button className={styles.ConnectButton}>Connect Socials</button>
          </Card> */}

          <Card m='4'>
          <Grid gap='4'>
            <Heading>Verify</Heading>
              <Callout.Root>
                <Callout.Icon>
                  <InfoCircledIcon height={20} width={20}/>
                </Callout.Icon>
                <Callout.Text>
                  {/* <Text color='gray' mb='2' size='2'> */}
                    Verified users have auto approve for any project apply and have 100% chance for
                    receiving airdrop. Instant verification price: 5 USDT
                  {/* </Text> */}
                </Callout.Text>
              </Callout.Root>
              <GlowingBtn size='3' onClick={handleDialogOpen}>Verify</GlowingBtn>

            <Sheet
              isOpen={isModalVisible}
              onClose={() => handleDialogClose()}
              detent='content-height'
            >
              <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                  {
                      <Theme>
                        <Grid gap='8' m='4' mb='5' align='center'>
                          <Flex  justify='center'>
                            <img width='80%' src={verified} alt='Verified icon' />
                          </Flex>
                          <Grid gap='2'>
                            <Heading mb='2'>Benefits of verified accounts 🔥</Heading>
                            <Blockquote>100% chance for Airdrop claim</Blockquote>
                            <Blockquote>Auto approve to any project</Blockquote>
                            <Blockquote>High priority for checking task completion</Blockquote>
                          </Grid>
                            
                          <GlowingBtn size='4' onClick={handleVerify} style={{ width: '100%' }}>
                            Verify Now
                          </GlowingBtn>
                        </Grid>
                      </Theme>
                  }
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop onTap={() => handleDialogClose()} />
            </Sheet>
            </Grid>
          </Card>

          <Card m='4'>
            <Flex align='center' justify='between'>
              <Heading size='4' mr='6'>
                Connect TON Wallet
              </Heading>
              <TonConnectButton />
            </Flex>
          </Card>
        </Tabs.Content>

        <Tabs.Content value='myprojects'>
          <MyProjectsPage />
        </Tabs.Content>

        <Tabs.Content value='transactions'>
          <TransactionsHistoryPage />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
