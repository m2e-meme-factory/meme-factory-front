import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Grid,
  Text,
  Card,
  Heading,
  Flex,
  Box,
  ScrollArea,
  Blockquote,
  Theme,
  Badge,
  Callout,
} from '@radix-ui/themes';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import GlowingButton, { AccentButton } from '../../shared/components/Buttons/GlowingButton';
import styled from 'styled-components';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import DeveloperMenu from '../../shared/components/DevMenu/DeveloperMenu';
import useDeveloperMenu from '../../shared/hooks/useDeveloperMenu';
import { Sheet } from 'react-modal-sheet';
import { ResponsibleImage } from '../../shared/components/ResponsibleImage';
import ConnectWallet from '../WalletPage/ConnectWallet';
import VideoCard from '../../shared/components/VideoCard';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { showErrorMessage, showSuccessMessage } from '../../shared/utils/helpers/notify';

enum TabsOption {
  AIRDROP = 'airdrop',
  ACCOUNT = 'account',
}

const TABS = [TabsOption.AIRDROP, TabsOption.ACCOUNT];


export const SolidCard = styled(Card)`
  &::before {
    backdrop-filter: none;
    background-color: none;
    -webkit-backdrop-filter: none;
    backdrop-filter: none;
  }
`;

const NftCard = styled(SolidCard) <{ glowing: boolean }>`
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: ease .2s;

  &:active {
    cursor: pointer;
    transform: scale(0.8)
  }

  animation: ${(props) => props.glowing ? 'glow 3s ease-in-out infinite alternate' : 'none'};

  @keyframes glow {
    0% {
      border: 1px solid var(--brand-color);
    }

    50% {
      border: 1px solid transparent;
    }

    100% {
      border: 1px solid var(--brand-color);
    }
  }
`;


const ImgWrapper = styled(Flex)`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 20vh;
  position: absolute;
  top: -10px;
  right: -50px;
  opacity: 0.3;
`

const nfts = [
  {
    "name": "Bronze",
    "img": "bronze.png",
    "discount": 0,
    "amount": 10,
    "price": 1,
  },
  {
    "name": "Silver",
    "img": "silver.png",
    "discount": 10,
    "amount": 100,
    "price": 0.9,
  },
  {
    "name": "Gold",
    "img": "gold.png",
    "discount": 20,
    "amount": 1000,
    "price": 0.8,
  },
  {
    "name": "Dimond",
    "img": "dimond.png",
    "discount": 30,
    "amount": 10000,
    "price": 0.7,
  },
]
function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const NftCardItem = ({ nft, handleBuy }: { nft: any, handleBuy: () => void }) => {


  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleVerify = () => {
    // if (user) {
    handleDialogClose();
    handleBuy()
    // verify({ params: { telegramId: user.telegramId } });
    // }
  };

  return (
    <NftCard onClick={handleDialogOpen} glowing={nft.name == "Gold"}>
      <Box>
        <Heading>{nft.name}</Heading>
        {nft.discount > 0 && <Badge color='green'>-{nft.discount}% discount</Badge>}
      </Box>
      <ImgWrapper>
        <img
          src={`${process.env.PUBLIC_URL}/imgs/${nft.img}`}
          style={{
            objectFit: 'cover',
            height: '100%',
          }}
        />
      </ImgWrapper>
      <Box>
        <Text color='gray'>
          {numberWithSpaces(nft.amount)} <Badge color='yellow'>M2E</Badge>
        </Text>
      </Box>

      <Sheet
        isOpen={isModalVisible}
        onClose={() => handleDialogClose()}
        detent='content-height'
      >
        <Theme appearance='dark'>
          <Sheet.Container style={{ overflowY: 'auto', background: '#121113' }}>
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

                    {/* <Text mb='2' align='center'>

                          You will get {numberWithSpaces(nft.amount)} after airdrop with 100% chance
                          </Text> */}
                  </Grid>

                  <GlowingButton
                    size='4'
                    onClick={handleVerify}
                    style={{ width: '100%' }}
                  >
                    Pay {nft.amount} USDT
                  </GlowingButton>
                </Grid>
              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Theme>
      </Sheet>
    </NftCard>

  )
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'airdrop';
  const { data: userDataResponse, isLoading: userDataLoading } = useAuthMe();
  const navigate = useNavigate();

  const webapp = useWebApp();

  const handleBack = useCallback(() => {
    navigate(-1);
    webapp.BackButton.hide();
  }, [navigate, webapp]);

  useEffect(() => {
    webapp.ready();
    webapp.BackButton.show();
    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, webapp]);


  useEffect(() => {
    if (userDataResponse) {
      dispatch(setUser(userDataResponse));
    }
  }, [userDataResponse]);


  const { handleClick, menuVisible, setMenuVisible, clearTutorial, clearGuides } = useDeveloperMenu();


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

  return (
    <Box height="90vh" onClick={handleClick}>
      {menuVisible && (
        <DeveloperMenu
          onClearTutorial={clearTutorial}
          onClearGuides={clearGuides}
          version={process.env.REACT_APP_VERSION || "none"}
        />
      )}
      <ScrollArea>
        <Flex asChild p="4" gap="6" direction="column">
          <Box pt='3' pb="3" style={{ maxHeight: '100%' }}>
            {/* <Box >
            <Flex direction='column' gap='5'>
              <Flex justify='center' align='center' gap='2' direction='column'>
                <Heading>
                  How to increase Airdrop chanceee?{' '}
                  <Popover.Root>
                    <Popover.Trigger>
                      <Flex align='center' display='inline-flex'>
                        <IconButton size='4' color='gray' variant='ghost' radius='full'>
                          <InfoCircledIcon />
                        </IconButton>
                      </Flex>
                    </Popover.Trigger>
                    <Popover.Content size='1' maxWidth='300px'>
                      <Text size='2'>
                        <b>Airdrop</b> is gift in real tokens for active users
                      </Text>
                    </Popover.Content>
                  </Popover.Root>
                </Heading>
              </Flex>
              <Flex direction='column' gap='2'>
                <Link
                  style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                  to='/friends'
                >
                  <Card>
                    <Flex justify='between' align='center' p='1'>
                      <Box>
                        <Box>Invite friends</Box>
                      </Box>
                      <Box>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          height='1.75rem'
                          viewBox='0 0 256 256'
                        >
                          <rect width='256' height='256' fill='none' />
                          <path
                            d='M192,120a59.91,59.91,0,0,1,48,24'
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='16'
                          />
                          <path
                            d='M16,144a59.91,59.91,0,0,1,48-24'
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='16'
                          />
                          <circle
                            cx='128'
                            cy='144'
                            r='40'
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='16'
                          />
                          <path
                            d='M72,216a65,65,0,0,1,112,0'
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='16'
                          />
                          <path
                            d='M161,80a32,32,0,1,1,31,40'
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='16'
                          />
                          <path
                            d='M64,120A32,32,0,1,1,95,80'
                            fill='none'
                            stroke='currentColor'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth='16'
                          />
                        </svg>
                      </Box>
                    </Flex>
                  </Card>
                </Link>

                <Link
                  style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                  to='/projects/autotasks'
                >
                  <Card>
                    <Flex justify='between' align='center' p='1'>
                      <Box>
                        <Box>Complete Tasks</Box>
                      </Box>
                      <Box>
                        <svg
                          xmlns='http://www.w3.org/2000/svg'
                          height='1.75rem'
                          fill='currentColor'
                          viewBox='0 0 256 256'
                        >
                          <path d='M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z'></path>
                        </svg>
                      </Box>
                    </Flex>
                  </Card>
                </Link>
              </Flex>
            </Flex>
          </Box> */}

            <Flex direction='column' gap='5'>
              <Heading weight="bold" >What is Meme Factory?</Heading>
              <VideoCard videoSrc={process.env.PUBLIC_URL + '/video/about.mp4'} thumbnailSrc={process.env.PUBLIC_URL + '/imgs/thumbnail.png'} altText='Tutorial' />
            </Flex>


            <Flex direction='column' gap='5'>
              <Heading weight="bold" >Buy <i>WhiteList NFTs</i> to get 100% airdrop chance</Heading>
              <Box
              // style={{background: 'radial-gradient(circle at 25% 60%, #3BBFFE 0, transparent 25%), radial-gradient(circle at 70% top, #D21372 0, #7120FD 60%)'}}
              >
                <Grid gap='4'>
                  <Grid gap='4' columns="2">
                    {nfts.map((nft, index) => (
                      <NftCardItem nft={nft} handleBuy={() => {
                        if (walletAddress) {
                          showSuccessMessage('NFT bought successfully!');
                        }
                        else {
                          showErrorMessage('Connect wallet first!');
                        }
                      }} key={index} />
                    ))}

                  </Grid>
                </Grid>
              </Box>
            </Flex>

            <ConnectWallet />

            <Card >
              <Grid gap='4'>
                <Heading mr='3'>More</Heading>

                <AccentButton onClick={() => navigate('/become-partner')} size='4'>
                  Become Advertiser
                </AccentButton>
              </Grid>
            </Card>
          </Box>
        </Flex>
      </ScrollArea>
    </Box>
  );
}
