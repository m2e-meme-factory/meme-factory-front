import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CaretRightIcon } from '@radix-ui/react-icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Grid, Text, Card, Heading, Flex, Box, Theme, Badge, Callout } from '@radix-ui/themes';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { Sheet } from 'react-modal-sheet';
import { useTonConnectUI } from '@tonconnect/ui-react';

import { Header } from '@widgets/header';

import ConnectWallet from '../WalletPage/ConnectWallet';

import { useAuthMe } from '@shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '@shared/utils/redux/user/userSlice';
import GlowingButton from '@shared/components/Buttons/GlowingButton';

import DeveloperMenu from '@shared/components/DevMenu/DeveloperMenu';
import useDeveloperMenu from '@shared/hooks/useDeveloperMenu';

import { ResponsibleImage } from '@shared/components/ResponsibleImage';
import VideoCard from '@shared/components/VideoCard';
import { showSuccessMessage } from '@shared/utils/helpers/notify';
import { SolidCard } from '@shared/components/Card/SolidCard';
import { connectWallet } from '@shared/utils/api/requests/ton/connect';
import YellowBorderButton from '@shared/components/Buttons/YellowBorderButton';

import styled from 'styled-components';

const NftCard = styled(SolidCard)<{
  glowing: boolean;
  bronzes: boolean;
  silvers: boolean;
  dimonds: boolean;
  investors: boolean;
}>`
  /* min-height: 12vh; */
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: ease 0.2s;
  ${(props) =>
    props.glowing
      ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #908a73 0%, #1c1c1e 100%);'
      : ''};
  ${(props) =>
    props.bronzes
      ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #7b675b 0%, #1c1c1e 100%);'
      : ''};
  ${(props) =>
    props.silvers
      ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #848484 0%, #1c1c1e 100%);'
      : ''};
  ${(props) =>
    props.dimonds
      ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #738e91 0%, #1c1c1e 100%);'
      : ''};
  ${(props) =>
    props.investors
      ? 'background: radial-gradient(118.04% 180.26% at 12% -43.46%, #7a6c84 0%, #1c1c1e 100%);'
      : ''};

  &:active {
    cursor: pointer;
    transform: scale(0.8);
  }

  animation: ${(props) => (props.glowing ? 'glow 3s ease-in-out infinite alternate' : 'none')};

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
  height: 15vh;
  position: absolute;
  top: -10px;
  right: -50px;
  opacity: 0.3;
`;

const nfts = [
  {
    name: 'Bronze',
    img: 'bronze.svg',
    discount: 0,
    amount: 10,
    price: 1,
  },
  {
    name: 'Silver',
    img: 'silver.svg',
    discount: 10,
    amount: 100,
    price: 0.9,
  },
  {
    name: 'Gold',
    img: 'gold.svg',
    discount: 20,
    amount: 1000,
    price: 0.8,
  },
  {
    name: 'Dimond',
    img: 'dimond.svg',
    discount: 30,
    amount: 10000,
    price: 0.7,
  },
];

const cyberNft = {
  name: 'Investor',
  img: 'cool.svg',
  discount: 40,
  amount: 100000,
  price: 0.6,
};

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
}

const NftCardItem = ({
  nft,
  handleBuy,
  wallet,
  style,
}: {
  nft: any;
  handleBuy: () => void;
  wallet: {
    isWallet: boolean;
    onConnect: () => void;
  };
  style?: React.CSSProperties;
}) => {
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    console.log('open');
    setModalVisible(true);
  };

  const handleVerify = () => {
    // if (user) {
    handleDialogClose();
    handleBuy();
    console.log(isModalVisible);
    // verify({ params: { telegramId: user.telegramId } });
    // }
  };

  return (
    <>
      <NftCard
        style={style}
        onClick={handleDialogOpen}
        glowing={nft.name == 'Gold'}
        bronzes={nft.name == 'Bronze'}
        silvers={nft.name == 'Silver'}
        dimonds={nft.name == 'Dimond'}
        investors={nft.name == 'Investor'}
      >
        <Flex direction='column' minHeight='10vh'>
          <Box>
            <Flex gap='3' justify='between' align='center'>
              <Flex gap='1'>
                <Heading size='2'>{nft.name}</Heading>
                <img
                  src={`${process.env.PUBLIC_URL}/imgs/${nft.img}`}
                  style={{
                    width: '18px',
                    height: '17px',
                  }}
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
            BUY
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
                      {nft.name}
                    </Heading>
                    <Text size='4' align='center'>
                      Get 100% chance for{' '}
                      <b>{numberWithSpaces(nft.amount + nft.amount * (nft.discount / 100))}</b>{' '}
                      <Badge color='yellow' size='3'>
                        M2E
                      </Badge>{' '}
                      tokens Airdrop
                    </Text>
                    <Callout.Root color='green' mt='2'>
                      <Callout.Text size='4'>
                        Price Discount: {nft.discount}%
                        <br />
                        <Text weight='bold'>M2E/USDT {nft.price}$ </Text>
                      </Callout.Text>
                    </Callout.Root>
                  </Grid>

                  {wallet.isWallet ? (
                    <GlowingButton
                      size='4'
                      onClick={() => {
                        handleDialogClose();
                        console.log(isModalVisible);
                        wallet.onConnect();
                      }}
                      style={{ width: '100%' }}
                    >
                      Connect Wallet
                    </GlowingButton>
                  ) : (
                    <GlowingButton size='4' onClick={handleVerify} style={{ width: '100%' }}>
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
  );
};

const GlowingCard = styled(Card)`
  &:active {
    cursor: pointer;
    transform: scale(0.8);
  }

  animation: 'glow 3s ease-in-out infinite alternate';

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

export default function ProfilePage() {
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'airdrop';
  const { data: userDataResponse, isLoading: userDataLoading } = useAuthMe();
  const navigate = useNavigate();
  const [indexSlideshow, setIndexSlideshow] = useState(0);

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

  const { handleClick, menuVisible, setMenuVisible, clearTutorial, clearGuides } =
    useDeveloperMenu();

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
    <Box height='90vh' onClick={handleClick}>
      <Box p='4' pt='3'>
        <Header />
      </Box>
      {menuVisible && (
        <DeveloperMenu
          onClearTutorial={clearTutorial}
          onClearGuides={clearGuides}
          version={process.env.REACT_APP_VERSION || 'none'}
        />
      )}
      <Flex asChild p='4' gap='5' direction='column'>
        <Box pt='3' pb='3' style={{ maxHeight: '100%' }}>
          <Flex direction='column' gap='5'>
            <Heading weight='regular' size='4'>
              What is Meme Factory?
            </Heading>
            <VideoCard
              videoSrc={process.env.PUBLIC_URL + '/video/about.mp4'}
              thumbnailSrc={process.env.PUBLIC_URL + '/imgs/thumbnail.png'}
              altText='Tutorial'
            />
          </Flex>

          <Flex direction='column' gap='3'>
            <Heading weight='regular' size='4'>
              Join our whitelist
            </Heading>

            <div className='slideshow'>
              <div
                className='slideshowSlider'
                style={{ transform: `translate3d(${-indexSlideshow * 100}%, 0, 0)` }}
              >
                {nfts.map((nft, index) => (
                  <NftCardItem
                    style={{
                      width: '100%',
                      display: 'inline-block',
                    }}
                    wallet={{
                      isWallet: tonConnectUI.connected,
                      onConnect: () => {
                        tonConnectUI.modal.open();
                      },
                    }}
                    nft={nft}
                    handleBuy={() => {
                      if (walletAddress) {
                        showSuccessMessage('NFT bought successfully!');
                      } else {
                        tonConnectUI.modal.open();
                        // showErrorMessage('Connect wallet first!');
                      }
                    }}
                    key={index}
                  />
                ))}
                <NftCardItem
                  wallet={{
                    isWallet: tonConnectUI.connected,
                    onConnect: () => {
                      tonConnectUI.modal.open();
                    },
                  }}
                  nft={cyberNft}
                  handleBuy={() => {
                    if (walletAddress) {
                      showSuccessMessage('NFT bought successfully!');
                    } else {
                      tonConnectUI.modal.open();
                      // showErrorMessage('Connect wallet first!');
                    }
                  }}
                  style={{
                    width: '100%',
                    display: 'inline-block',
                  }}
                />
              </div>

              <div className='slideshowDots'>
                {nfts.map((nft, idx) => (
                  <div
                    key={idx}
                    className={`slideshowDot${indexSlideshow === idx ? ' active' : ''}`}
                    onClick={() => {
                      setIndexSlideshow(idx);
                    }}
                  >
                    {nft.name}
                  </div>
                ))}
                <div
                  className={`slideshowDot${indexSlideshow === 4 ? ' active' : ''}`}
                  onClick={() => {
                    setIndexSlideshow(4);
                  }}
                >
                  {cyberNft.name}
                </div>
              </div>
            </div>
          </Flex>

          <Flex justify='center' align='center' gap='2' direction='column'>
            <Heading size='3'>Other ways increase Airdrop chance?</Heading>
          </Flex>
          <Flex direction='column' gap='3'>
            <Link
              style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
              to='/friends'
            >
              <SolidCard>
                <Flex justify='between' align='center'>
                  <Flex gap='3' align='center'>
                    <Box
                      style={{
                        backgroundColor: '#181818',
                        borderRadius: '8px',
                        padding: '6px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#A8A8A8',
                      }}
                    >
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M21.5 12H17.5M19.5 14L19.5 10'
                          stroke='currentColor'
                          stroke-width='1.2'
                          stroke-linecap='round'
                        />
                        <path
                          d='M3.5 19.1115C3.5 16.6984 5.19732 14.643 7.50404 14.2627L7.71182 14.2284C9.55892 13.9239 11.4411 13.9239 13.2882 14.2284L13.496 14.2627C15.8027 14.643 17.5 16.6984 17.5 19.1115C17.5 20.1545 16.6815 21 15.6719 21H5.32813C4.31848 21 3.5 20.1545 3.5 19.1115Z'
                          stroke='currentColor'
                          stroke-width='1.2'
                        />
                        <path
                          d='M14.5834 6.9375C14.5834 9.11212 12.7552 10.875 10.5 10.875C8.24486 10.875 6.41669 9.11212 6.41669 6.9375C6.41669 4.76288 8.24486 3 10.5 3C12.7552 3 14.5834 4.76288 14.5834 6.9375Z'
                          stroke='currentColor'
                          stroke-width='1.2'
                        />
                      </svg>
                    </Box>
                    <Box>
                      <Box
                        style={{ textTransform: 'uppercase', fontFamily: 'ME', fontSize: '15px' }}
                      >
                        Invite friends
                      </Box>
                    </Box>
                  </Flex>
                  <CaretRightIcon width={24} height={24} color='#A8A8A8' />
                </Flex>
              </SolidCard>
            </Link>

            <Link
              style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
              to='/all-tasks'
            >
              <SolidCard>
                <Flex justify='between' align='center'>
                  <Flex gap='3' align='center'>
                    <Box
                      style={{
                        backgroundColor: '#181818',
                        borderRadius: '8px',
                        padding: '6px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#A8A8A8',
                      }}
                    >
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        height='1.75rem'
                        fill='currentColor'
                        viewBox='0 0 256 256'
                      >
                        <path d='M215.79,118.17a8,8,0,0,0-5-5.66L153.18,90.9l14.66-73.33a8,8,0,0,0-13.69-7l-112,120a8,8,0,0,0,3,13l57.63,21.61L88.16,238.43a8,8,0,0,0,13.69,7l112-120A8,8,0,0,0,215.79,118.17ZM109.37,214l10.47-52.38a8,8,0,0,0-5-9.06L62,132.71l84.62-90.66L136.16,94.43a8,8,0,0,0,5,9.06l52.8,19.8Z'></path>
                      </svg>
                    </Box>
                    <Box>
                      <Box
                        style={{
                          textTransform: 'uppercase',
                          fontFamily: 'ME',
                          fontSize: '15px',
                          fontWeight: '400',
                        }}
                      >
                        Complete Fast Tasks
                      </Box>
                    </Box>
                  </Flex>
                  <CaretRightIcon width={24} height={24} color='#A8A8A8' />
                </Flex>
              </SolidCard>
            </Link>

            <Link
              style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
              to='/post-meme'
            >
              <SolidCard>
                <Flex justify='between' align='center'>
                  <Flex gap='3' align='center'>
                    <Box
                      style={{
                        backgroundColor: '#181818',
                        borderRadius: '8px',
                        padding: '6px',
                        width: '36px',
                        height: '36px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#A8A8A8',
                      }}
                    >
                      <svg
                        width='24'
                        height='24'
                        viewBox='0 0 24 24'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M9.25 13.8333C9.25 15.3522 11.7122 16.5833 14.75 16.5833C17.7878 16.5833 20.25 15.3522 20.25 13.8333C20.25 12.3143 17.7878 11.0833 14.75 11.0833C11.7122 11.0833 9.25 12.3143 9.25 13.8333Z'
                          stroke='currentColor'
                          stroke-width='1.2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M9.25 13.8333V17.5C9.25 19.018 11.7122 20.25 14.75 20.25C17.7878 20.25 20.25 19.018 20.25 17.5V13.8333M3.75 6.5C3.75 7.48267 4.79867 8.39017 6.5 8.8815C8.20133 9.37283 10.2987 9.37283 12 8.8815C13.7013 8.39017 14.75 7.48267 14.75 6.5C14.75 5.51733 13.7013 4.60983 12 4.1185C10.2987 3.62717 8.20133 3.62717 6.5 4.1185C4.79867 4.60983 3.75 5.51733 3.75 6.5Z'
                          stroke='currentColor'
                          stroke-width='1.2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M3.75 6.5V15.6667C3.75 16.4807 4.45767 16.9958 5.58333 17.5'
                          stroke='currentColor'
                          stroke-width='1.2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                        <path
                          d='M3.75 11.0833C3.75 11.8973 4.45767 12.4124 5.58333 12.9166'
                          stroke='currentColor'
                          stroke-width='1.2'
                          stroke-linecap='round'
                          stroke-linejoin='round'
                        />
                      </svg>
                    </Box>
                    <Box>
                      <Box
                        style={{ textTransform: 'uppercase', fontFamily: 'ME', fontSize: '15px' }}
                      >
                        Post Memes
                      </Box>
                    </Box>
                  </Flex>
                  <CaretRightIcon width={24} height={24} color='#A8A8A8' />
                </Flex>
              </SolidCard>
            </Link>
            <ConnectWallet />
          </Flex>

          <Box pb='5'>
            <Grid gap='4'>
              <Heading mr='3' size='4'>
                More
              </Heading>
              <YellowBorderButton
                size='4'
                onClick={() => navigate('/become-partner')}
                style={{ fontSize: '15px', fontWeight: '500', textTransform: 'uppercase' }}
              >
                Become Advertiser
              </YellowBorderButton>
            </Grid>
          </Box>
        </Box>
      </Flex>
      {/* </ScrollArea> */}
    </Box>
  );
}
