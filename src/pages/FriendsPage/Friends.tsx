import { Badge, Box, Card, DataList, Flex, Grid, Heading, Skeleton, Text } from '@radix-ui/themes';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { RefDataResponse } from 'api';
import handshake from '../../shared/imgs/handshake.webp';
import yeyEmoji from '../../shared/imgs/yey.png';
import styled from 'styled-components';
import GlowingButton from '../../shared/components/Buttons/GlowingButton';
import WebappBackButton from '../../shared/components/WebappBackButton';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import CopyableRef from '../AutotasksProject/components/CopyableField/CopyableRef';

const ResponsibleImage = styled.img`
  height: 100px;

  @media (min-height: 600px) {
    height: 100px;
  }
  @media (min-height: 800px) {
    height: 200px;
  }
  @media (min-width: 641px) {
    /* portrait tablets, portrait iPad, landscape e-readers, landscape 800x480 or 854x480 phones */
  }
  @media (min-width: 961px) {
    /* tablet, landscape iPad, lo-res laptops ands desktops */
  }
  @media (min-width: 1025px) {
    /* big landscape tablets, laptops, and desktops */
  }
  @media (min-width: 1281px) {
    /* hi-res laptops and desktops */
  }
`;

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

  const webApp = useWebApp();

  return (
    <>
      <WebappBackButton />
      <Flex m='4' justify='center'>
        <ResponsibleImage src={handshake} />
      </Flex>
      <Heading mb='4' align='center' size='8'>
        Invite Friends
      </Heading>

      <Box m='4'>
        <Flex direction='column' gap='2'>
          <Card>
            <Flex gap='4' align='center' p='1'>
              <Box>
                <Text size='8' weight='bold'>
                  1
                </Text>
              </Box>
              <Box>
                <Box>Invite friend</Box>
                <Box>
                  <Text size='1' color='gray'>
                    Copy Link and send it to your friend
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Card>

          <Card>
            <Flex gap='4' align='center' p='1'>
              <Box>
                <Text size='8' weight='bold'>
                  2
                </Text>
              </Box>
              <Box>
                <Box>Your Friend Join</Box>
                <Box>
                  <Text size='1' color='gray'>
                    Your friend join Meme Factory
                  </Text>
                </Box>
              </Box>
            </Flex>
          </Card>

          <Card>
            <Flex gap='4' align='center' p='1'>
              <Box>
                <Text size='8' weight='bold'>
                  3
                </Text>
              </Box>
              <Flex justify='between' width='100%' align='center'>
                <Box>
                  <Box>You get Reward</Box>
                  <Box>
                    <Text size='1' color='gray'>
                      You get 1000 <Badge color='bronze'>M2E</Badge> per each friend
                    </Text>
                  </Box>
                </Box>
                <img
                  style={{
                    height: 'var(--font-size-8)',
                  }}
                  src={yeyEmoji}
                />
              </Flex>
            </Flex>
          </Card>
        </Flex>

        <Card mt='5'>
          <Grid gap='4'>
            <Text color='gray'>Your Ref link:</Text>

            <Box asChild width='100%'>
              <Skeleton loading={refLoading}>
                <CopyableRef refLink={refData?.refLink ?? ''} />
              </Skeleton>
            </Box>
            <DataList.Root mt='4'>
              <DataList.Item align='center'>
                <DataList.Item>
                  <DataList.Label minWidth='88px'>Total Count</DataList.Label>
                  <Skeleton loading={refLoading}>
                    <DataList.Value>{refData?.count}</DataList.Value>
                  </Skeleton>
                </DataList.Item>
                <DataList.Item>
                  <DataList.Label minWidth='88px'>Total profit</DataList.Label>
                  <Skeleton loading={refLoading}>
                    <DataList.Value>
                      {(refData?.count || 0) * 1000}
                      <Badge color='bronze' ml='2'>
                        M2E
                      </Badge>
                    </DataList.Value>
                  </Skeleton>
                </DataList.Item>
              </DataList.Item>
            </DataList.Root>
          </Grid>
        </Card>
      </Box>
    </>
  );
}
