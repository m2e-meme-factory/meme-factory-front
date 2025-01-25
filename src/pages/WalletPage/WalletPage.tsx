import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTonConnectUI } from '@tonconnect/ui-react';
import {
  Grid,
  Text,
  Badge,
  Heading,
  Flex,
  Button,
  Box,
  Skeleton,
  AlertDialog,
} from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

import { Header } from '@widgets/header';

import { connectWallet } from '@shared/utils/api/requests/ton/connect';
import WebappBackButton from '@shared/components/WebappBackButton';
import { RootState } from '@shared/utils/redux/store';
import GlowingButton from '@shared/components/Buttons/GlowingButton';
import { LOCAL_TEXT } from '@shared/consts';

import 'swiper/css';

export default function WalletPage() {
  const { t } = useTranslation();
  const user = useSelector((state: RootState) => state.user.user);

  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string>();

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
      connect(walletAddress);
    }
  }, [walletAddress]);

  return (
    <>
      <Box p='4' pt='3'>
        <Header />
      </Box>

      <Flex
        direction='column'
        justify='center'
        ml='4'
        mr='4'
        gap='4'
        height='100%'
        style={{ paddingBottom: '12vh' }}
      >
        <WebappBackButton />

        <Box
          style={{
            borderRadius: '10px',
            background:
              ' url(imgs/ellipse-wall-1.svg) no-repeat top left, url(imgs/ellipse-wall-2.svg) no-repeat top right, linear-gradient(#1c1c1e, #1c1c1e)',
            padding: '24px',
          }}
        >
          <Flex direction='column' align='center' gap='2'>
            <img src='imgs/wallet.svg' width='168' height='168' alt='' />
            <Box>
              <Flex direction='column' align='center'>
                <Heading align='center' style={{ fontSize: '23px' }}>
                  {t(LOCAL_TEXT.CONNECT_WALLET)}
                </Heading>
                <Text style={{ fontSize: '16px' }}>{t(LOCAL_TEXT.TEXT_INFO)}</Text>
              </Flex>
            </Box>
          </Flex>
        </Box>

        <Box
          asChild
          width='100%'
          style={{ borderRadius: '10px', background: '#202020', padding: '12px' }}
        >
          <Grid gap='4'>
            <Flex direction='column'>
              <Heading style={{ fontSize: '18px' }}>{t(LOCAL_TEXT.AVALIABLE_BALANCE)}</Heading>
              <Skeleton width='8' loading={!user}>
                <Flex
                  gapX='3'
                  direction='row'
                  align='center'
                  style={{ width: 'fit-content', borderRadius: '5px' }}
                >
                  <Text>{user?.balance ?? '0'}</Text> <Badge color='bronze'>M2E</Badge>
                </Flex>
              </Skeleton>
            </Flex>
            {tonConnectUI.connected ? (
              <AlertDialog.Root>
                <AlertDialog.Trigger>
                  <Button
                    size='4'
                    style={{
                      backgroundColor: 'var(--gray-6)',
                      color: 'var(--gray-11)',
                    }}
                  >
                    {`${t(LOCAL_TEXT.CONNECTED)}: ` +
                      tonConnectUI.account?.address.slice(0, 3) +
                      '...' +
                      tonConnectUI.account?.address.slice(
                        tonConnectUI.account?.address.length - 3,
                        tonConnectUI.account?.address.length
                      ) || t(LOCAL_TEXT.DISCONNECT)}
                  </Button>
                </AlertDialog.Trigger>
                <AlertDialog.Content maxWidth='450px'>
                  <AlertDialog.Title>{t(LOCAL_TEXT.DISCONNECT_WALLET)}</AlertDialog.Title>
                  <Flex gap='3' mt='4' justify='end'>
                    <AlertDialog.Cancel>
                      <Button variant='soft' color='gray'>
                        {t(LOCAL_TEXT.CANCEL)}
                      </Button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action>
                      <Button variant='solid' color='red' onClick={() => tonConnectUI.disconnect()}>
                        {t(LOCAL_TEXT.DISCONNECT)}
                      </Button>
                    </AlertDialog.Action>
                  </Flex>
                </AlertDialog.Content>
              </AlertDialog.Root>
            ) : (
              <GlowingButton
                size='4'
                onClick={() => tonConnectUI.modal.open()}
                style={{ textTransform: 'uppercase', fontSize: '15px', fontWeight: 'bold' }}
              >
                {t(LOCAL_TEXT.CONNECT_WALLET)}
              </GlowingButton>
            )}
          </Grid>
        </Box>
      </Flex>
    </>
  );
}
