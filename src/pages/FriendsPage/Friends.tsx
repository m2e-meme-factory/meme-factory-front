import { useEffect, useState } from 'react';
import {
  Badge,
  Box,
  Card,
  DataList,
  Flex,
  Heading,
  IconButton,
  Skeleton,
  Text,
  TextField,
} from '@radix-ui/themes';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { RefDataResponse } from 'api';
import { CopyIcon } from '@radix-ui/react-icons';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

import { CARD_CONSTANT } from './cards-constant';

import { Header } from '@widgets/header';

import { useGetTransactionsSumById } from '@entities/transactions';

import GlowingButton from '@shared/components/Buttons/GlowingButton';
import WebappBackButton from '@shared/components/WebappBackButton';
import HandshakeAnimated from '@shared/components/LottieIcons/Handshake/HandshakeAnimated';

import { RootState } from '@shared/utils/redux/store';
import { useGetRefData } from '@shared/utils/api/hooks/user/useGetRefData';
import { showSuccessMessage } from '@shared/utils/helpers/notify';

import { LOCAL_TEXT } from '@shared/consts';

import { COLOR_CONSTANT } from '@styles/color-constant';
import { RADIUS_CONSTANT } from '@styles/radius-constant';

export default function Friends() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);

  const { data, isLoading: refLoading } = useGetRefData(user?.telegramId);
  const { data: transactionsData } = useGetTransactionsSumById(user?.telegramId || '');

  const [refData, setRefData] = useState<RefDataResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const webApp = useWebApp();

  const handleCopyText = (text: string) => {
    const textToCopy = text;

    if (navigator.clipboard && !copied) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showSuccessMessage(t(LOCAL_TEXT.COPIED));
          setCopied(true);

          setTimeout(() => {
            setCopied(false);
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
      setCopied(true);

      setTimeout(() => {
        setCopied(false);
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
                {CARD_CONSTANT.map((card, index) => (
                  <Card key={card.title} onClick={index === 0 ? handleInviteClick : undefined}>
                    <Flex gap='4' align='center'>
                      <Flex
                        justify={'center'}
                        align={'center'}
                        minWidth={'36px'}
                        height={'36px'}
                        p={'7px 0 4px'}
                        style={{
                          backgroundColor: COLOR_CONSTANT.BACK_GROUND_BADGE_NUMBER,
                          borderRadius: RADIUS_CONSTANT.LG,
                        }}
                      >
                        <Text size='3' weight='regular' style={{ fontFamily: 'ME' }}>
                          {index + 1}
                        </Text>
                      </Flex>
                      <Box>
                        <Heading mb={'1'} size='3' weight='regular' style={{ lineHeight: '1.2' }}>
                          {t(card.title)}
                        </Heading>
                        <Box>
                          <Text size='1' style={{ color: COLOR_CONSTANT.DISCRIPTION }}>
                            {t(card.description)}
                          </Text>
                        </Box>
                      </Box>
                    </Flex>
                  </Card>
                ))}
              </Flex>
            </Box>
          </Box>

          <Box style={{ padding: '12px', background: '#1c1c1e', borderRadius: '10px' }}>
            <Flex direction='column' gap='2'>
              <Heading size='3' weight='regular'>
                {t(LOCAL_TEXT.SHARE_YOUR_REF_LINK)}
              </Heading>
              <Flex
                direction='row'
                align='center'
                justify='between'
                style={{ width: '100%' }}
                gap='2'
              >
                <TextField.Root
                  size='3'
                  placeholder='https://'
                  defaultValue={refData?.refLink || ''}
                  style={{ width: '90%' }}
                  disabled={true}
                />
                <IconButton
                  size='3'
                  variant='classic'
                  onClick={() => handleCopyText(refData?.refLink || '')}
                >
                  <CopyIcon height='16' width='16' />
                </IconButton>
              </Flex>
              <DataList.Root mt='2' style={{ gap: '6px' }}>
                <DataList.Item align='center'>
                  <DataList.Item>
                    <DataList.Label minWidth='50px'>{t(LOCAL_TEXT.TOTAL_COUNT)}</DataList.Label>
                    <Skeleton loading={refLoading}>
                      <DataList.Value>{refData?.count || 0}</DataList.Value>
                    </Skeleton>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth='50px' width='auto'>
                      {t(LOCAL_TEXT.TOTAL_PROFIT)}
                    </DataList.Label>
                    <Skeleton loading={refLoading}>
                      <DataList.Value>
                        {transactionsData?.amount || 0}
                        <Badge color='bronze' ml='2'>
                          XP
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
