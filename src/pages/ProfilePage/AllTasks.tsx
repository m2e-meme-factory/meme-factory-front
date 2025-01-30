import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Text, Card, Heading, Flex, Box, ScrollArea, Theme, Badge } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';

import AutotaskCardDefaults from '../AutotasksProject/components/Autotask/AutotaskCardDefaults';

import { Header } from '@widgets/header';

import { useAuthMe } from '@shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '@shared/utils/redux/user/userSlice';
import GlowingButton from '@shared/components/Buttons/GlowingButton';
import { RootState } from '@shared/utils/redux/store';
import { useGetRefData } from '@shared/utils/api/hooks/user/useGetRefData';
import CoinbagAnimated from '@shared/components/LottieIcons/Coinbag/CoinbagAnimated';
import yeyEmoji from '@shared/imgs/yey.png';
import { ROUTES } from '@shared/consts/routes';
import { SolidCard } from '@shared/components/Card/SolidCard';
import BorderButton from '@shared/components/Buttons/BorderButton';
import YellowBorderButton from '@shared/components/Buttons/YellowBorderButton';
import { LOCAL_TEXT } from '@shared/consts';

import styled from 'styled-components';
import AutotaskCard from '@pages/AutotasksProject/components/Autotask/Autotask';
import { getIconByTaskId } from '@shared/utils/helpers/getIconByTaskId';
import useAutoTasks from './useAutoTasks';

const NftCard = styled(SolidCard)<{ glowing: boolean }>`
  min-height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: ease 0.2s;
  --card-border-width: 0;

  &:active {
    cursor: pointer;
    transform: scale(0.8);
  }
  color: ${(props) => (props.glowing ? 'black' : 'auto')};
  background: ${(props) =>
    props.glowing
      ? 'var(--brand-color)'
      : '#1c1c1e url(../imgs/ellipse.svg) no-repeat top right / cover'};
  filter: ${(props) => (props.glowing ? '' : 'filter: blur(119.19999694824219px);')};
  animation: ${(props) => (props.glowing ? 'glow 3s ease-in-out infinite alternate' : 'none')};

  @keyframes glow {
    0% {
      box-shadow: 0px 0px 20px 0px var(--brand-color);
    }

    50% {
      box-shadow: 0px 0px 20px -20px var(--brand-color);
    }

    100% {
      box-shadow: 0px 0px 20px 0px var(--brand-color);
    }
  }
`;

const ImgWrapper = styled(Flex)<{ opacity: number }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;

const autotasksLoading = false;
const autotasks = [
  {
    id: 21,
    title: 'Invite Friends',
    description:
      'Share your invite link with friends. After your Friend launch Meme Factory you will be rewarded',
    reward: '1000',
    url: '',
    isIntegrated: true,
    createdAt: '2024-10-11T20:46:24.682Z',
    autoTaskApplication: [],
  },
  {
    id: 24,
    title: 'Follow X',
    description: 'Stay updated with the latest news and updates by following Meme Factory on X.',
    reward: '100',
    url: 'https://twitter.com/m2e_pro',
    isIntegrated: false,
    createdAt: '2024-10-11T21:03:44.191Z',
    autoTaskApplication: [
      {
        id: 8,
        userId: 2,
        taskId: 24,
        isConfirmed: true,
        createdAt: '2024-10-30T12:36:48.743Z',
      },
    ],
  },
  {
    id: 25,
    title: 'Join Telegram',
    description: 'Become a part of the Meme Factory community by joining our Telegram channel.',
    reward: '100',
    url: 'https://t.me/m2e_pro',
    isIntegrated: false,
    createdAt: '2024-10-11T21:04:24.567Z',
    autoTaskApplication: [
      {
        id: 9,
        userId: 2,
        taskId: 25,
        isConfirmed: true,
        createdAt: '2024-10-30T13:15:56.378Z',
      },
    ],
  },
  {
    id: 26,
    title: 'Subscribe Youtube',
    description: 'Subscribe to our YouTube channel and be a part of our growing audience.',
    reward: '100',
    url: 'https://www.youtube.com/channel/UCZ94hPs00bBTxWsZjGZp_gQ',
    isIntegrated: false,
    createdAt: '2024-10-11T21:05:02.581Z',
    autoTaskApplication: [
      {
        id: 10,
        userId: 2,
        taskId: 26,
        isConfirmed: true,
        createdAt: '2024-10-30T13:16:59.571Z',
      },
    ],
  },
  {
    id: 27,
    title: 'Subscribe on Tik Tok',
    description: 'Subscribe to our Tik Tok channel and be a part of our growing audience.',
    reward: '100',
    url: 'https://www.tiktok.com/@m2e_pro',
    isIntegrated: false,
    createdAt: '2024-10-11T21:05:35.092Z',
    autoTaskApplication: [
      {
        id: 11,
        userId: 2,
        taskId: 27,
        isConfirmed: true,
        createdAt: '2024-10-30T13:17:52.138Z',
      },
    ],
  },
  {
    id: 28,
    title: 'Follow us on Instagram',
    description:
      'Follow MemeFactory on Instagram to stay updated with our latest posts, stories, and exclusive content.',
    reward: '100',
    url: 'https://www.instagram.com/m2e__pro/',
    isIntegrated: false,
    createdAt: '2024-10-11T21:06:18.960Z',
    autoTaskApplication: [],
  },
  {
    id: 29,
    title: 'Visit our Reddit',
    description: 'Show your support by liking our post on Raddit.',
    reward: '100',
    url: 'https://www.reddit.com/user/m2epro/',
    isIntegrated: false,
    createdAt: '2024-10-11T21:07:03.852Z',
    autoTaskApplication: [],
  },
  {
    id: 30,
    title: 'Join Discord',
    description: 'Become a part of the Meme Factory community by joining our Discord channel.',
    reward: '100',
    url: 'https://discord.com/channels/@me',
    isIntegrated: false,
    createdAt: '2024-10-11T21:08:05.936Z',
    autoTaskApplication: [],
  },
  {
    id: 23,
    title: 'Visit Website',
    description: 'Get rewarded for simply visiting our website!',
    reward: '100',
    url: 'https://m2e.pro/',
    isIntegrated: false,
    createdAt: '2024-10-11T21:02:51.554Z',
    autoTaskApplication: [],
  },
];

interface Task {
  category: string;
  completed: boolean;
}

export default function AllTasks() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { data: refData } = useGetRefData(user?.telegramId);
  const { data: userDataResponse } = useAuthMe();
  const navigate = useNavigate();

  const [tonConnectUI] = useTonConnectUI();

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

  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleSendVideoURL = () => {
    // if (user) {
    handleDialogClose();
    // verify({ params: { telegramId: user.telegramId } });
    // }
  };

  const {
    tasks, markTaskAsCompleted
  } = useAutoTasks()

  return (
    <Box height='90vh'>
      {/* <ScrollArea> */}
      <Flex asChild p='4' gap='6' direction='column'>
        <Box pt='3' pb='3' style={{ maxHeight: '100%' }}>
          <Flex direction='column' gap='4'>
            <Header />
            <Box>
              <Grid gap='4'>
                <Grid gap='3' columns='2'>
                  <NftCard onClick={() => navigate(ROUTES.POST_MEME)} glowing={true}>
                    <Box>
                      <ImgWrapper opacity={1}>
                        <img
                          src={`${process.env.PUBLIC_URL}/imgs/posting.png`}
                          style={{
                            width: '32px',
                            height: '35px',
                          }}
                          alt=''
                        />
                      </ImgWrapper>
                      <Heading size='3'>{t(LOCAL_TEXT.POST_MEME)}</Heading>
                      <Text>{t(LOCAL_TEXT.EARN_MONEY)}</Text>
                    </Box>
                    <BorderButton size='4'>{t(LOCAL_TEXT.START_POSTING)}</BorderButton>
                  </NftCard>

                  <NftCard onClick={handleDialogOpen} glowing={false}>
                    <Box>
                      <ImgWrapper opacity={1}>
                        <img
                          src={`${process.env.PUBLIC_URL}/imgs/review.svg`}
                          style={{
                            width: '36px',
                            height: '36px',
                          }}
                          alt=''
                        />
                      </ImgWrapper>
                      <Heading size='3'>{t(LOCAL_TEXT.GET_REVIEW)}</Heading>
                      <Text color='gray' size='2'>
                        {t(LOCAL_TEXT.MEME_REACHED_VIEWS_GET_REWARD)}
                      </Text>
                    </Box>
                    <YellowBorderButton size='4' style={{ height: '32px' }}>
                      {t(LOCAL_TEXT.GET)}
                    </YellowBorderButton>
                  </NftCard>
                </Grid>
              </Grid>
            </Box>
          </Flex>

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
                    <ScrollArea>
                      <Grid gap='8' mb='5' p='4' align='center'>
                        <Flex justify='center'>
                          <CoinbagAnimated />
                        </Flex>
                        <Flex direction='column' gap='2'>
                          <Card onClick={() => navigate(ROUTES.POST_MEME)}>
                            <Flex gap='4' align='center' p='1'>
                              <Box
                                style={{
                                  backgroundColor: '#2b2b2b',
                                  borderRadius: '8px',
                                  padding: '6px',
                                  width: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text size='8' weight='bold'>
                                  1
                                </Text>
                              </Box>
                              <Box>
                                <Box>{t(LOCAL_TEXT.POST_MEME)}</Box>
                                <Box>
                                  <Text size='1' color='gray'>
                                    {t(LOCAL_TEXT.FOLLOW_INSTRUCTIONS)}
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
                                <Box>{t(LOCAL_TEXT.YOUR_MEME_GETS_VIEWS)}</Box>
                                <Box>
                                  <Text size='1' color='gray'>
                                    {t(LOCAL_TEXT.YOU_GET)} 1 <Badge color='bronze'>XP</Badge>{' '}
                                    {t(LOCAL_TEXT.FOR_EACH_VIEW_AS_REWARD)}
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
                                  <Box>{t(LOCAL_TEXT.SEND_LINK_MODERATION)}</Box>
                                  <Box>
                                    <Text size='1' color='gray'>
                                      {t(
                                        LOCAL_TEXT.WAIT_UNTIL_GETS_MANY_VIEWS_POSSIBLE_BECAUSE_YOU_CAN_SEND_VIDEO_ONLY
                                      )}
                                    </Text>
                                  </Box>
                                </Box>
                                <img
                                  style={{
                                    height: 'var(--font-size-8)',
                                  }}
                                  src={yeyEmoji}
                                  alt=''
                                />
                              </Flex>
                            </Flex>
                          </Card>
                        </Flex>
                        <GlowingButton
                          size='4'
                          onClick={() => {
                            webapp.openLink('https://t.me/mf_sup_bot');
                          }}
                          style={{ width: '100%' }}
                        >
                          {t(LOCAL_TEXT.GET_REWARD)}
                        </GlowingButton>
                      </Grid>
                    </ScrollArea>
                  </Theme>
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop onTap={() => handleDialogClose()} />
            </Theme>
          </Sheet>

          <Flex direction='column' gap='2'>
            <Heading weight='bold' size='4'>
              {t(LOCAL_TEXT.FAST_TASKS)}
            </Heading>

            <Flex direction='column' mb='5'>
              <Flex align='center' mb='4'>
                <Text weight='light' size='3' color='gray'>
                  {t(LOCAL_TEXT.YOU_REWARDED_IMMEDIATELY_WITH_XP_AFTER_EACH_TASK_COMPLETION)}
                </Text>
              </Flex>
              <Flex justify='center' direction='column' gap='3'>
                {tasks.length > 0 && (
                  <>
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      title={t(LOCAL_TEXT.WELCOME_BONUS)}
                      description={''}
                      price={'5000'}
                      userId={Number(user?.id)}
                      applied={tasks[2].completed}
                      claimed={tasks[2].completed}
                      category={'welcome-bonus'}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      title={t(LOCAL_TEXT.CONNECT_WALLET)}
                      description={t(
                        LOCAL_TEXT.SECURE_YOUR_ACCOUNT_CONNECTING_YOUR_WALLET_START_EARNING_REWARDS
                      )}
                      price={'5000'}
                      userId={Number(user?.id)}
                      applied={tasks[0].completed}
                      claimed={tasks[0].completed}
                      category={'wallet'}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      title={t(LOCAL_TEXT.DAILY_CHECK_IN)}
                      description={t(
                        LOCAL_TEXT.LOG_IN_EVERY_DAY_CLAIM_YOUR_REWARD_AND_KEEP_YOUR_STREAK_ALIVE
                      )}
                      price={'1000'}
                      userId={Number(user?.id)}
                      applied={tasks[1].completed}
                      claimed={tasks[1].completed}
                      category={'checkin'}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      refLink={refData?.refLink}
                      title={t(LOCAL_TEXT.SHARE_IN_STORIES)}
                      description={''}
                      price={'10000'}
                      userId={Number(user?.id)}
                      applied={tasks[3].completed}
                      claimed={tasks[3].completed}
                      category={'shere-in-stories'}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      refLink={refData?.refLink}
                      title={t(LOCAL_TEXT.EDIT_ACCOUNT_INFO)}
                      description={''}
                      price={'10000'}
                      userId={Number(user?.id)}
                      applied={tasks[4].completed}
                      claimed={tasks[4].completed}
                      category={'account-bio'}
                    />

<AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.FOLLOW_X)}
    description={'Stay updated with the latest news and updates by following Meme Factory on X.'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[5].completed}
    claimed={tasks[5].completed}
    category={'open-x'}
    webUrl="https://twitter.com/m2e_pro"
/>

<AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.JOIN_TELEGRAM)}
    description={'Become a part of the Meme Factory community by joining our Telegram channel.'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[6].completed}
    claimed={tasks[6].completed}
    category={'open-tg'}
    webUrl="https://t.me/m2e_pro"
/>

<AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.SUBSCRIBE_YOUTUBE)}
    description={'Subscribe to our YouTube channel and be a part of our growing audience.'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[7].completed}
    claimed={tasks[7].completed}
    category={'open-youtube'}
    webUrl="https://www.youtube.com/channel/UCZ94hPs00bBTxWsZjGZp_gQ"
/>

<AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.SUBSCRIBE_TIKTOK)}
    description={'Subscribe to our TikTok channel and be a part of our growing audience.'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[8].completed}
    claimed={tasks[8].completed}
    category={'open-tiktok'}
    webUrl="https://www.tiktok.com/@m2e_pro"
/>

<AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.VISIT_REDDIT)}
    description={'Show your support by liking our post on Reddit.'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[9].completed}
    claimed={tasks[9].completed}
    category={'open-reddit'}
    webUrl="https://www.reddit.com/user/m2epro/"
/>

<AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.JOIN_DISCORD)}
    description={'Become a part of the Meme Factory community by joining our Discord channel.'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[10].completed}
    claimed={tasks[10].completed}
    category={'open-discord'}
    webUrl="https://discord.com/channels/@me"
/>

{/* <AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.FOLLOW_INSTAGRAM)}
    description={'Follow MemeFactory on Instagram to stay updated with our latest posts, stories, and exclusive content.'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[11].completed}
    claimed={tasks[11].completed}
    category={'web-url'}
    webUrl="https://www.instagram.com/m2e__pro/"
/> */}

<AutotaskCardDefaults
    markTaskCompleted={markTaskAsCompleted}
    title={t(LOCAL_TEXT.VISIT_WEBSITE)}
    description={'Get rewarded for simply visiting our website!'}
    price={'100'}
    userId={Number(user?.id)}
    applied={tasks[11].completed}
    claimed={tasks[11].completed}
    category={'web-url'}
    webUrl="https://m2e.pro/"
/>


                  </>
                )}
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
