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
import { useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { RefDataResponse, User } from 'api';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import { useSearchParams } from 'react-router-dom';

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [userSt, setUserSt] = useState<User>();
  const { data: userDataResponse } = useAuthMe();
  const [refData, setRefData] = useState<RefDataResponse | null>(null);
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'account';

  useEffect(() => {
    if (userDataResponse) {
      setUserSt(userDataResponse.data);
      dispatch(setUser(userDataResponse.data));
    }
  }, [userDataResponse]);

  const {
    data,
    isLoading: refLoading,
  } = useGetRefData(userSt?.telegramId);

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
