import { useEffect, useRef, useState } from 'react';
import {
  Badge,
  Box,
  Card,
  DataList,
  Flex,
  Heading,
  Skeleton,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useSelector } from 'react-redux';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';

import { RefDataResponse } from 'api';

import { Header } from '@widgets/header';

import { useGetRefData } from '@shared/utils/api/hooks/user/useGetRefData';
import { RootState } from '@shared/utils/redux/store';
import GlowingButton from '@shared/components/Buttons/GlowingButton';
import WebappBackButton from '@shared/components/WebappBackButton';
import { showSuccessMessage } from '@shared/utils/helpers/notify';
import HandshakeAnimated from '@shared/components/LottieIcons/Handshake/HandshakeAnimated';
import { LOCAL_TEXT } from '@shared/consts';

import styled from 'styled-components';

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
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);
  const { data, isLoading: refLoading } = useGetRefData(user?.telegramId);
  const [refData, setRefData] = useState<RefDataResponse | null>(null);
  const webApp = useWebApp();
  const [copied, setCopied] = useState(false);
  const [copyText, setCopyText] = useState<'copied' | 'click on me'>('click on me');
  const copyableFieldRef = useRef<HTMLDivElement | null>(null);

  const handleCopyText = (text: string) => {
    const textToCopy = text;

    if (navigator.clipboard && !copied) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showSuccessMessage(t(LOCAL_TEXT.COPIED));
          setCopyText('copied');
          setCopied(true);

          setTimeout(() => {
            setCopied(false);
            setCopyText('click on me');
          }, 5000);
        })
        .catch(() => {
          console.error(t(LOCAL_TEXT.CLIPBOARD_COPY_FAILED_USING_FALLBACK_METHOD));
          copyFallback(textToCopy);
        });
    } else if (!copied) {
      copyFallback(textToCopy);
    }
  };

  const copyFallback = (text: string) => {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    tempInput.setSelectionRange(0, text.length);

    try {
      document.execCommand('copy');
      showSuccessMessage(t(LOCAL_TEXT.COPIED));
      setCopyText('copied');
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
        setCopyText('click on me');
      }, 5000);
    } catch (error) {
      console.error(t(LOCAL_TEXT.FALLBACK_COPY_FAILED), error);
    }

    document.body.removeChild(tempInput);
  };

  const handleInviteClick = () => {
    handleCopyText(refData?.refLink || '');
  };

  const handleShareClick = () => {
    const message =
      t(LOCAL_TEXT.JOIN_ME_ON_MEME_FACTORY_EARN_TOGETHER) +
      t(LOCAL_TEXT.USE_MY_INVITE_LINK_JOIN_FUN);
    const shareUrl = `https://t.me/share/url?text=${encodeURIComponent(message)}&url=${encodeURIComponent(refData?.refLink || '')}`;
    webApp.openTelegramLink(shareUrl);
  };

  useEffect(() => {
    if (data) {
      setRefData(data);
    }
  }, [data]);

  return (
    <>
      <Flex direction='column' gap='4'>
        <Box p='4' pt='3'>
          <Header />
        </Box>

        <WebappBackButton />
        <Flex direction='column' gap='5' pl='4' pr='4' pb='8'>
          <Box
            pb='2'
            style={{
              background: 'url("imgs/frends.svg") center -50px/ 100% no-repeat rgb(28, 28, 30) ',
              borderRadius: '10px',
            }}
          >
            <Flex m='4' justify='center'>
              <HandshakeAnimated />
            </Flex>

            <Heading mb='4' align='center' size='6'>
              {t(LOCAL_TEXT.INVITE_FRIENDS_LOWER)}
            </Heading>

            <Box m='4'>
              <Flex direction='column' gap='2'>
                <Card onClick={handleInviteClick} style={{ padding: '14px 12px' }}>
                  <Flex gap='4' align='center'>
                    <Box
                      style={{
                        backgroundColor: '#2b2b2b',
                        borderRadius: '8px',
                        padding: '7px 0 4px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text size='3' weight='regular' style={{ fontFamily: 'ME', lineHeight: '1' }}>
                        1
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='3' weight='regular' style={{ lineHeight: '1.1' }}>
                        {t(LOCAL_TEXT.INVITE_FRIENDS_LOWER)}
                      </Heading>
                      <Box>
                        <Text size='1' color='gray'>
                          {t(LOCAL_TEXT.COPY_LINK_SEND_YOUR_FRIEND)}
                        </Text>
                      </Box>
                    </Box>
                  </Flex>
                </Card>

                <Card style={{ padding: '14px 12px' }}>
                  <Flex gap='4' align='center'>
                    <Box
                      style={{
                        backgroundColor: '#2b2b2b',
                        borderRadius: '8px',
                        padding: '7px 0 4px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text size='3' weight='regular' style={{ fontFamily: 'ME' }}>
                        2
                      </Text>
                    </Box>
                    <Box>
                      <Heading size='3' weight='regular' style={{ lineHeight: '1.1' }}>
                        {t(LOCAL_TEXT.YOUR_FRIEND_JOIN)}
                      </Heading>
                      <Box>
                        <Text size='1' color='gray'>
                          {t(LOCAL_TEXT.YOUR_FRIEND_JOIN_MEME_FACTORY)}
                        </Text>
                      </Box>
                    </Box>
                  </Flex>
                </Card>

                <Card>
                  <Flex gap='4' align='center'>
                    <Box
                      style={{
                        backgroundColor: '#2b2b2b',
                        borderRadius: '8px',
                        padding: '7px 0 4px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text size='3' weight='regular' style={{ fontFamily: 'ME' }}>
                        3
                      </Text>
                    </Box>
                    <Flex justify='between' width='100%' align='center'>
                      <Box>
                        <Heading size='3' weight='regular' style={{ lineHeight: '1.1' }}>
                          {t(LOCAL_TEXT.YOU_GET_REWARD)}
                        </Heading>
                        <Box
                          style={{ maxWidth: '24ch', lineHeight: '133%', letterSpacing: '0.03em' }}
                        >
                          <Text color='gray' style={{ fontSize: '12px' }}>
                            {t(LOCAL_TEXT.YOU_GET_PER_EACH_FRIEND_HIS_INCOME)}
                          </Text>
                        </Box>
                      </Box>
                    </Flex>
                  </Flex>
                </Card>
              </Flex>
            </Box>
          </Box>

          <Box style={{ padding: '12px', background: '#1c1c1e', borderRadius: '10px' }}>
            <Flex direction='column' gap='2'>
              <Heading size='3' weight='regular'>
                {t(LOCAL_TEXT.SHARE_YOUR_REF_LINK)}
              </Heading>
              <TextField.Root size='3' placeholder='https://' />
              <DataList.Root mt='2' style={{ gap: '6px' }}>
                <DataList.Item align='center'>
                  <DataList.Item>
                    <DataList.Label minWidth='50px'>{t(LOCAL_TEXT.TOTAL_COUNT)}</DataList.Label>
                    <Skeleton loading={refLoading}>
                      <DataList.Value>{refData?.count}</DataList.Value>
                    </Skeleton>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth='50px' width='auto'>
                      {t(LOCAL_TEXT.TOTAL_PROFIT)}
                    </DataList.Label>
                    <Skeleton loading={refLoading}>
                      <DataList.Value>
                        {(refData?.count || 0) * 5000}
                        <Badge color='bronze' ml='2'>
                          M2E
                        </Badge>
                      </DataList.Value>
                    </Skeleton>
                  </DataList.Item>
                </DataList.Item>
              </DataList.Root>
              <Box asChild width='100%'>
                <Skeleton loading={refLoading}>
                  <GlowingButton size='3' mt='2' onClick={handleShareClick}>
                    {t(LOCAL_TEXT.SHARE)}
                  </GlowingButton>
                </Skeleton>
              </Box>
            </Flex>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
