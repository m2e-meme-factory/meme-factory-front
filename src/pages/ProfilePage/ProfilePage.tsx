import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CaretRightIcon } from '@radix-ui/react-icons';
import { Link, useNavigate } from 'react-router-dom';
import { Grid, Heading, Flex, Box } from '@radix-ui/themes';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useTranslation } from 'react-i18next';

import { Header } from '@widgets/header';

import ConnectWallet from '../WalletPage/ConnectWallet';

import { useAuthMe } from '@shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '@shared/utils/redux/user/userSlice';
import { LOCAL_TEXT } from '@shared/consts/local-text';
import useDeveloperMenu from '@shared/hooks/useDeveloperMenu';
import VideoCard from '@shared/components/VideoCard';
import { SolidCard } from '@shared/components/Card/SolidCard';
import { connectWallet } from '@shared/utils/api/requests/ton/connect';
import YellowBorderButton from '@shared/components/Buttons/YellowBorderButton';
import { Swiper, SwiperClass, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';
import { cyberNft, nfts } from '@pages/ProfilePage/ProfilePage.consts';
import { NftCardItem } from '@pages/ProfilePage/NftCardItem';
import DeveloperMenu from '@shared/components/DevMenu/DeveloperMenu';
import { showSuccessMessage } from '@shared/utils/helpers/notify';

export default function ProfilePage() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { data: userDataResponse, isLoading: userDataLoading } = useAuthMe();
  const navigate = useNavigate();
  const [swiperInstance, setSwiperInstance] = useState<SwiperClass | null>(null)
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

  const handlePaginationClick = (index: number) => {
    setIndexSlideshow(index);
    if (swiperInstance) {
      swiperInstance.slideTo(index);
    }
  };

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
              {t(LOCAL_TEXT.WHAT_MEMO_FACTORY)}
            </Heading>
            <VideoCard
              videoSrc={process.env.PUBLIC_URL + '/video/about.mp4'}
              thumbnailSrc={process.env.PUBLIC_URL + '/imgs/thumbnail.png'}
              altText='Tutorial'
            />
          </Flex>

          <Flex direction='column' gap='3'>
            <Heading weight='regular' size='4'>
              {t(LOCAL_TEXT.JOIN_OUR_WHITELIST)}
            </Heading>

              <div>
                <Swiper
                  modules={[Autoplay]}
                  autoplay={{ delay: 3000 }}
                  onSwiper={(swiper: SwiperClass) => setSwiperInstance(swiper)}
                  onSlideChange={(swiper: SwiperClass) => setIndexSlideshow(swiper.activeIndex)}
                >
                  {nfts.map((nft, index) => (
                    <SwiperSlide>
                      <NftCardItem
                        style={{marginRight: '5px', marginLeft: '5px'}}
                        wallet={{
                          isWallet: tonConnectUI.connected,
                          onConnect: () => {
                            tonConnectUI.modal.open()
                          }
                        }} nft={nft} handleBuy={() => {
                        if (walletAddress) {
                          showSuccessMessage(t(LOCAL_TEXT.NTF_BOUGHT_SUCCESSFULLY));
                        }
                        else {
                          tonConnectUI.modal.open()
                        }
                      }} key={index} /></SwiperSlide>
                  ))}
                  <SwiperSlide>
                    <NftCardItem wallet={{
                      isWallet: tonConnectUI.connected,
                      onConnect: () => {
                        tonConnectUI.modal.open()
                      }
                    }}
                                 nft={cyberNft} handleBuy={() => {
                      if (walletAddress) {
                        showSuccessMessage(t(LOCAL_TEXT.NTF_BOUGHT_SUCCESSFULLY));
                      }
                      else {
                        tonConnectUI.modal.open()
                      }
                    }}/>
                    </SwiperSlide>
                </Swiper>
              </div>

                <div className="slideshowDots">
                  {nfts.map((nft, idx) => (
                    <div
                      key={idx}
                      className={`slideshowDot${indexSlideshow === idx ? " active" : ""}`}
                      onClick={() => {
                        handlePaginationClick(idx);
                      }}
                      style={{
                        padding: '6px 2px',
                      }}
                    >
                      {t(nft.name)}
                    </div>
                  ))}
                  <div
                    className={`slideshowDot${indexSlideshow === 4 ? " active" : ""}`}
                    onClick={() => {
                      handlePaginationClick(4);
                    }}
                    style={{
                      padding: '6px 2px',
                    }}
                  >
                    {t(cyberNft.name)}
                    </div>
                </div>
            </Flex>

          <Flex justify='center' align='center' gap='2' direction='column'>
            <Heading size='3'>{t(LOCAL_TEXT.OTHER_WAYS_INCREASE_AIRDROP_CHANCE)}</Heading>
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
                        {t(LOCAL_TEXT.INVITE_FRIENDS_LOWER_IMPERATIVE)}
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
                        {t(LOCAL_TEXT.COMPLETE_FAST_TASKS_SIMPLE)}
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
                        {t(LOCAL_TEXT.POST_MEMES)}
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
                {t(LOCAL_TEXT.MORE)}
              </Heading>
              <YellowBorderButton
                size='4'
                onClick={() => navigate('/become-partner')}
                style={{ fontSize: '15px', fontWeight: '500', textTransform: 'uppercase' }}
              >
                {t(LOCAL_TEXT.BECOME_ADVERTISER)}
              </YellowBorderButton>
            </Grid>
          </Box>
        </Box>
      </Flex>
    </Box>
  );
}
