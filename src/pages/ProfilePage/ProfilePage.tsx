import * as React from 'react';
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
import { useGetUserData } from '../../shared/utils/api/hooks/user/useGetUserData';
import { ChevronRightIcon, GearIcon } from '@radix-ui/react-icons';
import styles from './ProfilePage.module.css';
import { Link } from 'react-router-dom';
import MyProjectsPage from '../MyProjectsPage/MyProjectsPage';
import TransactionsHistoryPage from '../TransactionsHistoryPage/TransactionsHistoryPage';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';

export default function ProfilePage() {
  const user = useSelector((state: RootState) => state.user.user);
  const userId = user?.telegramId?.toString();

  const { data: userRes, isLoading: userLoading } = useGetUserData(userId);
  const { data: refData, isLoading: refLoading } = useGetRefData(userId);

   if (userLoading || refLoading) {
     return (
       <Flex className={styles.LoadingContainer} align='center' justify='center'>
         <Spinner size='3' />
       </Flex>
    );
  }

  const type = 'platform';

  const userData = userRes?.data;
  const refCount = refData?.data?.count;
  const refUUID = userData?.refCode;

  return (
    <Tabs.Root defaultValue='account'>
      <Tabs.List justify='center' highContrast>
        <Tabs.Trigger value='account'>Account</Tabs.Trigger>
        <Tabs.Trigger value='transactions'>Transactions</Tabs.Trigger>
        {type === 'platform' && <Tabs.Trigger value='dashboard'>Dashboard</Tabs.Trigger>}
        {type === 'platform' && <Tabs.Trigger value='my-projects'>Projects</Tabs.Trigger>}
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
                    <CopyableCode value={userId || ''} />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth='88px'>Nickname</DataList.Label>
                  <DataList.Value>
                    <CopyableCode value={`${user?.username}`} />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth='88px'>Type</DataList.Label>
                  <DataList.Value>{user?.role}</DataList.Value>
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
                <Heading>$26 412.03</Heading>
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
              <CopyableTextField
                size={'2'}
                fieldSize='3'
                value={`https://t.me/m2e_meme_factory_bot?start=ref_${refUUID}`}
              />
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

        <Tabs.Content value='dashboard'>
          <Card m='4'>
            <Flex justify='between'>
              <Heading>Dashboard</Heading>
              <Link to='/create-project'>
                <Button>Create Project</Button>
              </Link>
            </Flex>
          </Card>
        </Tabs.Content>

        <Tabs.Content value='my-projects'>
          <MyProjectsPage />
        </Tabs.Content>

        <Tabs.Content value='transactions'>
          <TransactionsHistoryPage />
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
