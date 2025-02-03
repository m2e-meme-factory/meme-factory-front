import { CSSProperties, useState } from 'react';
import { TonConnectUI, Wallet, WalletInfoWithOpenMethod } from '@tonconnect/ui-react';
import { Badge, Box, Callout, Flex, Grid, Heading, Text, Theme } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import { useTranslation } from 'react-i18next';

import { NftCard } from './NftCard';

import YellowBorderButton from '@shared/components/Buttons/YellowBorderButton';
import { ResponsibleImage } from '@shared/components/ResponsibleImage';
import GlowingButton from '@shared/components/Buttons/GlowingButton';
import { LOCAL_TEXT } from '@shared/consts';

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

export const NftCardItem = ({
  nft,
  handleBuy,
  tonConnectUI,
  wallet,
  style,
}: {
  nft: any;
  tonConnectUI: TonConnectUI;
  handleBuy: (value: number, planSeqno: number) => void;
  wallet: Wallet | (Wallet & WalletInfoWithOpenMethod) | null;
  style?: CSSProperties;
}) => {
  const { t } = useTranslation();
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleVerify = (value: number, planSeqno: number) => {
    handleDialogClose();
    handleBuy(value, planSeqno);
  };

  return (
    <>
      <NftCard
        style={style}
        onClick={handleDialogOpen}
        glowing={nft.name === LOCAL_TEXT.GOLD}
        bronzes={nft.name === LOCAL_TEXT.BRONZE}
        silvers={nft.name === LOCAL_TEXT.SILVER}
        dimonds={nft.name === LOCAL_TEXT.DIAMOND}
        investors={nft.name === LOCAL_TEXT.INVESTOR}
      >
        <Flex direction='column' minHeight='10vh'>
          <Box>
            <Flex gap='3' justify='between' align='center'>
              <Flex gap='1'>
                <Heading size='2'>{t(nft.name)}</Heading>
                <img
                  src={`${process.env.PUBLIC_URL}/imgs/${nft.img}`}
                  style={{
                    width: '18px',
                    height: '17px',
                  }}
                  alt=''
                />
              </Flex>
              {nft.discount > 0 && <Badge color='gray'>-{nft.discount}%</Badge>}
            </Flex>
          </Box>
          <Box>
            <Text
              color='gray'
              style={{ fontSize: '11px', lineHeight: '145%', letterSpacing: '0.03em' }}
              weight='regular'
            >
              {numberWithSpaces(nft.amount)} USDT = {numberWithSpaces(nft.amount)} MF
            </Text>
          </Box>
          <YellowBorderButton size='4' style={{ marginTop: 'auto', height: '32px' }}>
            {t(LOCAL_TEXT.BUY)}
          </YellowBorderButton>
        </Flex>
      </NftCard>

      <Sheet isOpen={isModalVisible} onClose={() => handleDialogClose()} detent='content-height'>
        <Theme appearance='dark'>
          <Sheet.Container
            style={{
              overflowY: 'auto',
              background: '#121113 url(/imgs/modal-ellipse.svg) no-repeat 50% 0',
            }}
          >
            <Sheet.Header />
            <Sheet.Content>
              <Theme>
                <Grid gap='8' mb='5' p='4' align='center'>
                  <Flex justify='center'>
                    <ResponsibleImage src={`${process.env.PUBLIC_URL}/imgs/${nft.img}`} />
                  </Flex>
                  <Grid gap='2'>
                    <Heading mb='2' align='center'>
                      {t(nft.name)}
                    </Heading>
                    <Text size='4' align='center'>
                      {t(LOCAL_TEXT.GET)} 100% {t(LOCAL_TEXT.CHANCE_FOR)}{' '}
                      <b>{numberWithSpaces(nft.amount + nft.amount * (nft.discount / 100))}</b>{' '}
                      <Badge color='yellow' size='3'>
                        M2E
                      </Badge>{' '}
                      {t(LOCAL_TEXT.TOKENS)} Airdrop
                    </Text>
                    <Callout.Root color='green' mt='2'>
                      <Callout.Text size='4'>
                        {t(LOCAL_TEXT.PRICE_DISCOUNT)}: {nft.discount}%
                        <br />
                        <Text weight='bold'>M2E/USDT {nft.price}$ </Text>
                      </Callout.Text>
                    </Callout.Root>
                  </Grid>

                  {wallet ? (
                    <GlowingButton
                      size='4'
                      onClick={() => handleVerify(nft.amount, 0)}
                      style={{ width: '100%' }}
                    >
                      {t(LOCAL_TEXT.PAY)} {nft.amount} USDT
                    </GlowingButton>
                  ) : (
                    <GlowingButton
                      size='4'
                      onClick={() => {
                        handleDialogClose();
                        console.log(isModalVisible);
                        tonConnectUI.openModal();
                      }}
                      style={{ width: '100%' }}
                    >
                      {t(LOCAL_TEXT.CONNECT_WALLET)}
                    </GlowingButton>
                  )}
                </Grid>
              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Theme>
      </Sheet>
    </>
  );
};
