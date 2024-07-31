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
import { useTelegram } from '../../shared/hooks/useTelegram';
import CopyableCode from '../../shared/components/CopyableCode';
import CopyableTextField from '../../shared/components/CopyableTextField';
import { useGetRefData } from '../../shared/utils/api/hooks/useGetRefData';
import { useGetUserData } from '../../shared/utils/api/hooks/useGetUserData';
import { ChevronRightIcon } from '@radix-ui/react-icons';
import styles from './ProfilePage.module.css';

export default function ProfilePage() {
  const { user, webApp } = useTelegram();
  const tg = webApp;

  const userId = user?.id?.toString();

  const { data: userRes, isLoading: userLoading } = useGetUserData('', userId);
  const refId = userRes?.data?.user?.refId?.toString();
  const { data: refData, isLoading: refLoading } = useGetRefData('', refId);

  if (userLoading || refLoading) {
    return (
      <Flex className={styles.LoadingContainer} align='center' justify='center'>
        <Spinner size='3' />
      </Flex>
    );
  }

  const userData = userRes?.data?.user;
  const refCount = refData?.data?.count || '0';
  const refUUID = userData?.ref_uuid || '';

  return (
    <Tabs.Root defaultValue='account'>
      <Tabs.List justify='center' highContrast>
        <Tabs.Trigger value='account'>Account</Tabs.Trigger>
        <Tabs.Trigger value='wallet'>Wallet</Tabs.Trigger>
        <Tabs.Trigger value='socials'>Socials</Tabs.Trigger>
      </Tabs.List>

      <Box pt='3'>
        <Tabs.Content value='account'>
          <Card m='4'>
            <Grid gap='4'>
              <Heading>Profile</Heading>
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
                  <DataList.Label minWidth='88px'>Name</DataList.Label>
                  <DataList.Value>{`${user?.last_name} ${user?.first_name}`}</DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth='88px'>Nickname</DataList.Label>
                  <DataList.Value>
                    <CopyableCode value={`${user?.username}`} />
                  </DataList.Value>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth='88px'>Type</DataList.Label>
                  <DataList.Value>Creator</DataList.Value>
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

        <Tabs.Content value='wallet'>
          <Card m='4'>
            <Heading>Wallet</Heading>
            <button className={styles.ConnectButton}>Connect Wallet</button>
          </Card>
        </Tabs.Content>

        <Tabs.Content value='socials'>
          <Card m='4'>
            <Heading>Socials</Heading>
            <button className={styles.ConnectButton}>Connect Socials</button>
          </Card>
        </Tabs.Content>
      </Box>
    </Tabs.Root>
  );
}
