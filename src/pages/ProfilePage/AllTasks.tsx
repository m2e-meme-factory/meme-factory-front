import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Text, Card, Heading, Flex, Box, ScrollArea, Theme, Badge } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';

import AutotaskCardDefaults from '../AutotasksProject/components/Autotask/AutotaskCardDefaults';
import useAutoTasks from './useAutoTasks';
import { AUTO_TASKS } from './constant/auto-tasks';

import { Header } from '@widgets/header';

import { useAuthMe } from '@shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '@shared/utils/redux/user/userSlice';
import { RootState } from '@shared/utils/redux/store';
import { useGetRefData } from '@shared/utils/api/hooks/user/useGetRefData';
import { isMobileDevice } from '@shared/utils/helpers/is-mobile-device';

import YellowBorderButton from '@shared/components/Buttons/YellowBorderButton';
import { SolidCard } from '@shared/components/Card/SolidCard';
import BorderButton from '@shared/components/Buttons/BorderButton';
import GlowingButton from '@shared/components/Buttons/GlowingButton';
import CoinbagAnimated from '@shared/components/LottieIcons/Coinbag/CoinbagAnimated';

import { ROUTES } from '@shared/consts/routes';
import { LOCAL_TEXT } from '@shared/consts';

import yeyEmoji from '@shared/imgs/yey.png';
import styled from 'styled-components';

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

export default function AllTasks() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const { data: refData } = useGetRefData(user?.telegramId);
  const { data: userDataResponse } = useAuthMe();

  const webapp = useWebApp();
  const isRu = i18n.language === 'ru';
  const isMobile = isMobileDevice();

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

  const { mapAutoTasks, isLoading: isLoadingAutoTasks, handleMarkTaskAsCompleted } = useAutoTasks();

  return (
    <Box height='90vh'>
      <Flex asChild p='4' gap='6' direction='column'>
        <Box pt='3' pb='3' style={{ maxHeight: '100%' }}>
          <Flex direction='column' gap='4'>
            <Header />
            <Box>
              <Grid gap='4'>
                <Grid gap='3' columns='2'>
                  <NftCard onClick={() => navigate(ROUTES.POST_MEME)} glowing={true}>
                    <Box mb={'2'}>
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
                      <Heading size='3' style={isRu && isMobile ? { fontSize: '14px' } : {}}>
                        {t(LOCAL_TEXT.POST_MEME)}
                      </Heading>
                      <Text>{t(LOCAL_TEXT.EARN_MONEY)}</Text>
                    </Box>
                    <BorderButton size='4'>{t(LOCAL_TEXT.START_POSTING)}</BorderButton>
                  </NftCard>

                  <NftCard onClick={handleDialogOpen} glowing={false}>
                    <Box mb={'2'}>
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
                      <Heading size='3' style={isRu && isMobile ? { fontSize: '14px' } : {}}>
                        {t(LOCAL_TEXT.GET_REVIEW)}
                      </Heading>
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
                {AUTO_TASKS.map((task) => (
                  <AutotaskCardDefaults
                    key={task.title}
                    markTaskCompleted={handleMarkTaskAsCompleted}
                    refLink={refData?.refLink}
                    title={task.title !== '' ? t(task.title) : ''}
                    description={task.description !== '' ? t(task.description) : ''}
                    price={mapAutoTasks?.get(task.category)?.reward || 0}
                    userId={Number(user?.id)}
                    applied={Boolean(mapAutoTasks?.get(task.category)?.isClaimed)}
                    claimed={Boolean(mapAutoTasks?.get(task.category)?.isClaimed)}
                    category={task.category}
                    webUrl={task.webUrl}
                    isLoading={isLoadingAutoTasks}
                  />
                ))}
              </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}
