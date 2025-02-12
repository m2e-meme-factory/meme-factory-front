import { useEffect, useState } from 'react';
import { Grid, Card, Flex, Button, Box, AlertDialog } from '@radix-ui/themes';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';

import { useMixpanelContext } from '@providers/provider-mixpanel';

import { connectWallet } from '@shared/utils/api/requests/ton/connect';
import GlowingButton from '@shared/components/Buttons/GlowingButton';
import { LOCAL_TEXT } from '@shared/consts';
import { MIXPANEL_EVENT } from '@shared/consts/mixpanel-event';

export default function ConnectWallet({ onSuccess }: { onSuccess?: (value: string) => void }) {
  const { t } = useTranslation();
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string>();
  const { trackEvent } = useMixpanelContext();

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        setWalletAddress(wallet.account.address);
        trackEvent(MIXPANEL_EVENT.WALLET_CONNECTED);
      } else {
        setWalletAddress('');
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI]);

  useEffect(() => {
    const connect = async (wallet: string) => {
      await connectWallet({ params: { tonWalletAddress: wallet } });

      if (onSuccess) {
        onSuccess(wallet);
      }
    };

    if (walletAddress) {
      connect(walletAddress);
    }
  }, [walletAddress]);

  return (
    <Box asChild width='100%'>
      <Card style={{ padding: '0', marginTop: '20px' }}>
        <Grid gap='4'>
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
              style={{ fontSize: '15px', fontWeight: '700' }}
            >
              {t(LOCAL_TEXT.CONNECT_WALLET).toUpperCase()}
            </GlowingButton>
          )}
        </Grid>
      </Card>
    </Box>
  );
}
