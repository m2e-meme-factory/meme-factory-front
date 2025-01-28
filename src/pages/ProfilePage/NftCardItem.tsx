import { CSSProperties, useState } from 'react';
import { Badge, Box, Callout, Flex, Grid, Heading, Text, Theme } from '@radix-ui/themes';
import YellowBorderButton from '../../shared/components/Buttons/YellowBorderButton';
import { Sheet } from 'react-modal-sheet';
import { ResponsibleImage } from '../../shared/components/ResponsibleImage';
import GlowingButton from '../../shared/components/Buttons/GlowingButton';
import { NftCard } from './NftCard';

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export const NftCardItem = ({ nft, handleBuy, wallet, style }: { nft: any, handleBuy: () => void, wallet: {
    isWallet: boolean
    onConnect: () => void
  }, style?: CSSProperties }) => {


  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleVerify = () => {
    handleDialogClose();
    handleBuy()
  };

  return (
    <>
      <NftCard style={style} onClick={handleDialogOpen} glowing={nft.name == "Gold"} bronzes={nft.name == "Bronze"} silvers={nft.name == "Silver"} dimonds={nft.name == "Dimond"} investors={nft.name == "Investor"}>
        <Flex direction='column' minHeight='10vh'>
          <Box>
            <Flex gap="3" justify='between' align='center'>
              <Flex gap='1'>
                <Heading size='2'>{nft.name}</Heading>
                <img src={`${process.env.PUBLIC_URL}/imgs/${nft.img}`} style={{
                  width: '18px', height: '17px'
                }}/>
              </Flex>
              {nft.discount > 0 && <Badge color='gray'>-{nft.discount}%</Badge>}
            </Flex>
          </Box>
          <Box>
            <Text color='gray' style={{ fontSize: '11px', lineHeight: '145%', letterSpacing: '0.03em'}} weight='regular'>
              {numberWithSpaces(nft.amount)} USDT = {numberWithSpaces(nft.amount)} MF
            </Text>
          </Box>
          <YellowBorderButton size='4' style={{ marginTop: 'auto', height: '32px'}}>
            BUY
          </YellowBorderButton>
        </Flex>
      </NftCard>

      <Sheet
        isOpen={isModalVisible}
        onClose={() => handleDialogClose()}
        detent='content-height'
      >
        <Theme appearance='dark'>
          <Sheet.Container style={{ overflowY: 'auto', background: '#121113 url(/imgs/modal-ellipse.svg) no-repeat 50% 0' }}>
            <Sheet.Header />
            <Sheet.Content>
              <Theme>
                <Grid gap='8' mb='5' p="4" align='center'>
                  <Flex justify='center'>
                    <ResponsibleImage src={`${process.env.PUBLIC_URL}/imgs/${nft.img}`} />
                  </Flex>
                  <Grid gap='2'>
                    <Heading mb='2' align='center'>
                      {nft.name}
                    </Heading>
                    <Text size="4" align="center">
                      Get 100% chance for <b>{numberWithSpaces(nft.amount + nft.amount * (nft.discount / 100))}</b> <Badge color='yellow' size="3">M2E</Badge> tokens Airdrop
                    </Text>
                    <Callout.Root color='green' mt="2">
                      <Callout.Text size="4">
                        Price Discount: {nft.discount}%
                        <br />
                        <Text weight="bold">M2E/USDT {nft.price}$ </Text>
                      </Callout.Text>
                    </Callout.Root>
                  </Grid>

                  {wallet.isWallet ? (
                    <GlowingButton
                      size='4'
                      onClick={() => {
                        handleDialogClose();
                        console.log(isModalVisible)
                        wallet.onConnect()
                      }}
                      style={{ width: '100%' }}
                    >
                      Connect Wallet
                    </GlowingButton>
                  ) : (
                    <GlowingButton
                      size='4'
                      onClick={handleVerify}
                      style={{ width: '100%' }}
                    >
                      Pay {nft.amount} USDT
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

  )
}