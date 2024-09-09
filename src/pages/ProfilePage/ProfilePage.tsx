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
} from '@radix-ui/themes';
import CopyableCode from '../../shared/components/CopyableCode';
import CopyableTextField from '../../shared/components/CopyableTextField';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { ArrowLeftIcon, ChevronRightIcon, GearIcon } from '@radix-ui/react-icons';
import styles from './ProfilePage.module.css';
import { Link } from 'react-router-dom';
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

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [userSt, setUserSt] = useState<User>();
  const { data: userDataResponse } = useAuthMe();
  const [refData, setRefData] = useState<RefDataResponse | null>(null);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';

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
      verifyMutation.mutate({ params: { userId: user.id } });
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
                <Link to='/profile/settings'>
                  <IconButton variant='soft'>
                    <GearIcon />
                  </IconButton>
                </Link>
              </Flex>
              <DataList.Root>
                <DataList.Item align='center'>
                  <DataList.Label minWidth='88px'>Status</DataList.Label>
                  <DataList.Value>
                    <Badge color='jade' variant='soft' radius='full'>
                      Authorized
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
                <Heading>${userSt?.balance ?? '0'}</Heading>
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

          <Card m='4'>
            <Heading>Socials</Heading>
            <button className={styles.ConnectButton}>Connect Socials</button>
          </Card>

          <Card m='4'>
            <Heading>Verify</Heading>
            <Text color='gray' size='2'>
              Verified users have auto approve for any project apply and have 100% chance for
              receiving airdrop. Instant verification price: 5 USDT
            </Text>

            <Dialog.Root>
              <Dialog.Trigger>
                <button className={styles.ConnectButton}>Verify now</button>
              </Dialog.Trigger>

              <Dialog.Content maxWidth='450px'>
                <Dialog.Title>Verify now</Dialog.Title>
                <Dialog.Description size='2' mb='4'>
                  Are you sure you want to verify your profile?
                </Dialog.Description>

                <Flex gap='3' mt='4' justify='end'>
                  <Dialog.Close>
                    <Button variant='soft' color='gray'>
                      Cancel
                    </Button>
                  </Dialog.Close>
                  <Dialog.Close>
                    <Button onClick={handleVerify}>Verify</Button>
                  </Dialog.Close>
                </Flex>
              </Dialog.Content>
            </Dialog.Root>
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
