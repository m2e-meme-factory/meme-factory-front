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
} from '@radix-ui/themes';
import CopyableCode from '../../shared/components/CopyableCode';
import CopyableTextField from '../../shared/components/CopyableTextField';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { ChevronRightIcon, GearIcon } from '@radix-ui/react-icons';
import styles from './ProfilePage.module.css';
import { Link } from 'react-router-dom';
import MyProjectsPage from '../MyProjectsPage/MyProjectsPage';
import TransactionsHistoryPage from '../TransactionsHistoryPage/TransactionsHistoryPage';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { login, LoginConfig } from '../../shared/utils/api/requests/auth/login';
import { useTelegram } from '../../shared/hooks/useTelegram';
import { useEffect, useState } from 'react';
import { Role } from '../../shared/consts/userRoles';
import { RefDataResponse } from 'api';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.telegramId?.toString();
  const userRole = user ? user.role : Role.CREATOR;
  const { webApp } = useTelegram();
  const [refData, setRefData] = useState<RefDataResponse | null>(null);

  const {
    data,
    isLoading: refLoading,
    error: refDataError,
    refetch: refetchRefData,
  } = useGetRefData(userId);

  useEffect(() => {
    if(data) {
      setRefData(data.data);
    }
  }, [data]);

  useEffect(() => {
    const handleErrors = async () => {
      if (refDataError) {
        if (webApp) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: webApp.initData } },
          };
          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            const { data } = await refetchRefData();
            setRefData(data?.data || null);

          } catch (loginError) {
            console.error('Login failed:', loginError);
          }
        }
      }
    };

    handleErrors();
  }, [refDataError, webApp, refetchRefData]);

  if (refLoading) {
    return (
      <Flex className={styles.LoadingContainer} align="center" justify="center">
        <Spinner size="3" />
      </Flex>
    );
  }

  const refCount = refData?.count;

  return (
    <Tabs.Root defaultValue="account">
      <Tabs.List justify="center" highContrast>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="transactions">Transactions</Tabs.Trigger>
        {userRole === Role.ADVERTISER && <Tabs.Trigger value="dashboard">Dashboard</Tabs.Trigger>}
        {userRole === Role.ADVERTISER && <Tabs.Trigger value="my-projects">Projects</Tabs.Trigger>}
      </Tabs.List>

      <Box pt="3">
        <Tabs.Content value="account">
          <Card m="4">
            <Grid gap="4">
              <Flex align="center">
                <Heading mr="3">Profile</Heading>
                <Link to="/profile/settings">
                  <IconButton variant="soft">
                    <GearIcon />
                  </IconButton>
                </Link>
              </Flex>
              <DataList.Root>
                <DataList.Item align="center">
                  <DataList.Label minWidth="88px">Status</DataList.Label>
                  <DataList.Value>
                    <Badge color="jade" variant="soft" radius="full">
                      Authorized
                    </Badge>
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">ID</DataList.Label>
                  <DataList.Value>
                    <CopyableCode value={userId || ''} />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Nickname</DataList.Label>
                  <DataList.Value>
                    <CopyableCode value={`${user?.username}`} />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth="88px">Type</DataList.Label>
                  <DataList.Value>{user?.role}</DataList.Value>
                </DataList.Item>
              </DataList.Root>
            </Grid>
          </Card>

          <Card m="4">
            <Flex justify="between" align="center">
              <Flex direction="column">
                <Text mb="2" color="gray">
                  Available Balance
                </Text>
                <Heading>$26 412.03</Heading>
              </Flex>
              <Button>
                <ChevronRightIcon /> Withdraw
              </Button>
            </Flex>
          </Card>

          <Card m="4">
            <Grid gap="4">
              <Heading>Referas</Heading>
              <Text color="gray">Your Ref link:</Text>
              <CopyableTextField
                size={'2'}
                fieldSize="3"
                value={refData?.refLink || ' '}
              />
              <DataList.Root mt="4">
                <DataList.Item align="center">
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Total Count</DataList.Label>
                    <DataList.Value>{refCount}</DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Total profit</DataList.Label>
                    <DataList.Value>0 M2E</DataList.Value>
                  </DataList.Item>
                </DataList.Item>
              </DataList.Root>
            </Grid>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="dashboard">
          <Card m="4">
            <Flex justify="between">
              <Heading>Dashboard</Heading>
              <Link to="/create-project">
                <Button>Create Project</Button>
              </Link>
            </Flex>
          </Card>
        </Tabs.Content>

        <Tabs.Content value="my-projects">
          <MyProjectsPage />
        </Tabs.Content>

        <Tabs.Content value="transactions">
          <TransactionsHistoryPage />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
