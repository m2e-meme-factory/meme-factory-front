import {
  Badge,
  Button,
  Callout,
  Card,
  DataList,
  Flex,
  Grid,
  Heading,
  Spinner,
  Text,
} from '@radix-ui/themes';
import * as React from 'react';
import packageJson from '../../../package.json';
import CopyableTextField from '../../shared/components/CopyableTextField';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { useEffect, useState } from 'react';
import styles from '../ProfilePage/ProfilePage.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { RefDataResponse } from 'api';
import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';

export default function Friends() {
  const user = useSelector((state: RootState) => state.user.user);
  const { data, isLoading: refLoading } = useGetRefData(user?.telegramId);
  const [refData, setRefData] = useState<RefDataResponse | null>(null);
  const [isCalloutVisible, setCalloutVisible] = useState<boolean>(true);

  useEffect(() => {
    if (data) {
      setRefData(data);
    }
  }, [data]);

  if (refLoading) {
    return (
      <Flex className={styles.LoadingContainer} align='center' justify='center'>
        <Spinner size='3' />
      </Flex>
    );
  }

  return (
    <>
      <Flex m='4'>
        {isCalloutVisible && (
          <Callout.Root color='yellow' style={{ position: 'relative', padding: '1rem' }}>
            <Callout.Icon style={{ marginTop: '0.5rem' }}>
              <InfoCircledIcon />
            </Callout.Icon>
            <Callout.Text style={{ marginTop: '0.5rem', marginRight: '0.2rem' }}>
              Invite your friends to the Meme Factory and earn M2E rewards together! By bringing
              your friends along, you can unlock exclusive content, boost your earnings, and make
              meme-making even more enjoyable. Don’t miss out on the fun—start inviting today!
            </Callout.Text>
            <button
              onClick={() => {
                setCalloutVisible(false);
              }}
              style={{
                position: 'absolute',
                top: '0.5rem',
                right: '0.5rem',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <Cross2Icon />
            </button>
          </Callout.Root>
        )}
      </Flex>
      <Card m='4'>
        <Grid gap='4'>
          <Heading>Referals</Heading>
          <Text color='gray'>Your Ref link:</Text>
          <CopyableTextField size={'2'} fieldSize='3' value={refData?.refLink || ' '} />
          <DataList.Root mt='4'>
            <DataList.Item align='center'>
              <DataList.Item>
                <DataList.Label minWidth='88px'>Total Count</DataList.Label>
                <DataList.Value>{refData?.count}</DataList.Value>
              </DataList.Item>
              <DataList.Item>
                <DataList.Label minWidth='88px'>Total profit</DataList.Label>
                <DataList.Value>0 M2E</DataList.Value>
              </DataList.Item>
            </DataList.Item>
          </DataList.Root>
        </Grid>
      </Card>
      {/*<Card m='4'>*/}
      {/*  <Grid gap='4'>*/}
      {/*    <Heading>About Page</Heading>*/}
      {/*    <DataList.Root>*/}
      {/*      <DataList.Item align='center'>*/}
      {/*        <DataList.Label minWidth='88px'>App version:</DataList.Label>*/}
      {/*        <DataList.Value>*/}
      {/*          <Badge color='jade' variant='soft' radius='full'>*/}
      {/*            {packageJson.version}*/}
      {/*          </Badge>*/}
      {/*        </DataList.Value>*/}
      {/*      </DataList.Item>*/}
      {/*    </DataList.Root>*/}
      {/*    <Text color='gray' size='2'>*/}
      {/*      Access token:*/}
      {/*    </Text>*/}
      {/*    <CopyableTextField size={'2'} fieldSize='3' value={localStorage.getItem('token') ?? ''} />*/}
      {/*  </Grid>*/}
      {/*</Card>*/}
    </>
  );
}
