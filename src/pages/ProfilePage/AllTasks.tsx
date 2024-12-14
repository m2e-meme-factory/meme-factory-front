import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Grid,
  Text,
  Card,
  Heading,
  Flex,
  Box,
  ScrollArea,
  Theme,
  Badge,
  Callout,
} from '@radix-ui/themes';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import GlowingButton, { AccentButton } from '../../shared/components/Buttons/GlowingButton';
import styled from 'styled-components';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { Sheet } from 'react-modal-sheet';
import { showErrorMessage, showSuccessMessage } from '../../shared/utils/helpers/notify';
import { SolidCard } from './ProfilePage';
import { RootState } from '../../shared/utils/redux/store';
import AutotaskCard from '../AutotasksProject/components/Autotask/Autotask';
import { getIconByTaskId } from '../../shared/utils/helpers/getIconByTaskId';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import CoinbagAnimated from '../../shared/components/LottieIcons/Coinbag/CoinbagAnimated';
import { InfoCircleOutlined } from '@ant-design/icons';
import yeyEmoji from '../../shared/imgs/yey.png';
import { ROUTES } from '../../shared/consts/routes';

const NftCard = styled(SolidCard) <{ glowing: boolean }>`
  height: 25vh;
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: space-between; */
  transition: ease .2s;

  &:active {
    cursor: pointer;
    transform: scale(0.8)
  }
  color: ${(props) => props.glowing ? "black" : "auto" };
  background: ${(props) => props.glowing ? "var(--brand-color)" : "auto" };
  animation: ${(props) => props.glowing ? 'glow 3s ease-in-out infinite alternate' : 'none'};
  

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


const ImgWrapper = styled(Flex)<{opacity: number}>`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 17vh;
  position: absolute;
  bottom: -10px;
  right: -5px;
  opacity: ${props => props.opacity};
`

function numberWithSpaces(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

const autotasksLoading = false;
  const autotasks = [
    {
        "id": 21,
        "title": "Invite Friends",
        "description": "Share your invite link with friends. After your Friend launch Meme Factory you will be rewarded",
        "reward": "1000",
        "url": "",
        "isIntegrated": true,
        "createdAt": "2024-10-11T20:46:24.682Z",
        "autoTaskApplication": []
    },
    {
        "id": 24,
        "title": "Follow X",
        "description": "Stay updated with the latest news and updates by following Meme Factory on X.",
        "reward": "100",
        "url": "https://twitter.com/m2e_pro",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:03:44.191Z",
        "autoTaskApplication": [
            {
                "id": 8,
                "userId": 2,
                "taskId": 24,
                "isConfirmed": true,
                "createdAt": "2024-10-30T12:36:48.743Z"
            }
        ]
    },
    {
        "id": 25,
        "title": "Join Telegram",
        "description": "Become a part of the Meme Factory community by joining our Telegram channel.",
        "reward": "100",
        "url": "https://t.me/m2e_pro",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:04:24.567Z",
        "autoTaskApplication": [
            {
                "id": 9,
                "userId": 2,
                "taskId": 25,
                "isConfirmed": true,
                "createdAt": "2024-10-30T13:15:56.378Z"
            }
        ]
    },
    {
        "id": 26,
        "title": "Subscribe Youtube",
        "description": "Subscribe to our YouTube channel and be a part of our growing audience.",
        "reward": "100",
        "url": "https://www.youtube.com/channel/UCZ94hPs00bBTxWsZjGZp_gQ",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:05:02.581Z",
        "autoTaskApplication": [
            {
                "id": 10,
                "userId": 2,
                "taskId": 26,
                "isConfirmed": true,
                "createdAt": "2024-10-30T13:16:59.571Z"
            }
        ]
    },
    {
        "id": 27,
        "title": "Subscribe on Tik Tok",
        "description": "Subscribe to our Tik Tok channel and be a part of our growing audience.",
        "reward": "100",
        "url": "https://www.tiktok.com/@m2e_pro",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:05:35.092Z",
        "autoTaskApplication": [
            {
                "id": 11,
                "userId": 2,
                "taskId": 27,
                "isConfirmed": true,
                "createdAt": "2024-10-30T13:17:52.138Z"
            }
        ]
    },
    {
        "id": 28,
        "title": "Follow us on Instagram",
        "description": "Follow MemeFactory on Instagram to stay updated with our latest posts, stories, and exclusive content.",
        "reward": "100",
        "url": "https://www.instagram.com/m2e__pro/",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:06:18.960Z",
        "autoTaskApplication": []
    },
    {
        "id": 29,
        "title": "Visit our Reddit",
        "description": "Show your support by liking our post on Raddit.",
        "reward": "100",
        "url": "https://www.reddit.com/user/m2epro/",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:07:03.852Z",
        "autoTaskApplication": []
    },
    {
        "id": 30,
        "title": "Join Discord",
        "description": "Become a part of the Meme Factory community by joining our Discord channel.",
        "reward": "100",
        "url": "https://discord.com/channels/@me",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:08:05.936Z",
        "autoTaskApplication": []
    },
    {
        "id": 23,
        "title": "Visit Website",
        "description": "Get rewarded for simply visiting our website!",
        "reward": "100",
        "url": "https://m2e.pro/",
        "isIntegrated": false,
        "createdAt": "2024-10-11T21:02:51.554Z",
        "autoTaskApplication": []
    }
]


export default function AllTasks() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { data: refData, isLoading: refLoading } = useGetRefData(user?.telegramId);
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

  return (
    <Box height="90vh">
      <ScrollArea>
        <Flex asChild p="4" gap="6" direction="column">
          <Box pt='3' pb="3" style={{ maxHeight: '100%' }}>
            <Flex direction='column' gap='5'>
              <Heading align="center">{numberWithSpaces(user ? Number(user.balance) : 0)} <Badge size="3" color="bronze">XP-M2E</Badge></Heading>
              <Box>
                <Grid gap='4'>
                  <Grid gap='4' columns="2">
                  <NftCard onClick={() => navigate(ROUTES.POST_MEME)} glowing={true}>
                    <Box>
                      <Heading>Post Meme</Heading>
                      <Text>Earn Money</Text>
                    </Box>
                    <ImgWrapper opacity={0.92}>
                      <img
                        src={`${process.env.PUBLIC_URL}/imgs/black-huynya.png`}
                        style={{
                          objectFit: 'cover',
                          height: '100%',
                        }}
                      />
                    </ImgWrapper>
                  </NftCard>

                  <NftCard onClick={handleDialogOpen} glowing={false}>
                    <Box>
                      <Heading>Review Video</Heading>
                    </Box>
                    <ImgWrapper opacity={0.3}>
                      <img
                        src={`${process.env.PUBLIC_URL}/imgs/rocket.png`}
                        style={{
                          objectFit: 'cover',
                          height: '100%',
                        }}
                      />
                    </ImgWrapper>
                    <Box pt="1">
                      <Text color='gray'>
                        Video riched 10K views, get Reward
                      </Text>
                    </Box>
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
                <Grid gap='8' mb='5' p="4" align='center'>
                  <Flex justify='center'>
                    <CoinbagAnimated />
                  </Flex>
                  <Flex direction='column' gap='2'>
          <Card onClick={() => {}}>
            <Flex gap='4' align='center' p='1'>
              <Box>
                <Text size='8' weight='bold'>
                  1
                </Text>
              </Box>
              <Box>
                <Box>Post Meme</Box>
                <Box>
                  <Text size='1' color='gray'>
                    follow the instructions 
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
                <Box>Your Meme gets {">"}10K views</Box>
                <Box>
                  <Text size='1' color='gray'>
                    You get 1 <Badge color='bronze'>XP-M2E</Badge> for each 1 view as reward
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
                  <Box>You send link to Moderation</Box>
                  <Box>
                    <Text size='1' color='gray'>
                      Wait unitl it gets as much views as possible, because you can send video only once
                    </Text>
                  </Box>
                </Box>
                <img
                  style={{
                    height: 'var(--font-size-8)',
                  }}
                  src={yeyEmoji}
                />
              </Flex>
            </Flex>
          </Card>
        </Flex>
                  <GlowingButton
                    size='4'
                    onClick={handleSendVideoURL}
                    style={{ width: '100%' }}
                  >
                    Get Reward
                  </GlowingButton>
                </Grid>
              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Theme>
      </Sheet>

            <Flex direction='column' gap='2'>
          <Heading weight='bold'>Fast Tasks</Heading>

          <Flex direction='column' mb='5'>
            <Flex align='center' mb='4'>
              <Text weight='light' size='3' color='gray'>
                You'll be rewarded immediately with XP-M2E after each task completion
              </Text>
            </Flex>
            <Flex justify='center' direction='column' gap='2'>
              {autotasks?.map((task) => (
                <AutotaskCard
                  key={task.id}
                  id={task.id}
                  title={task.title}
                  description={task.description}
                  price={task.reward}
                  url={task.url}
                  userId={Number(user?.id)}
                  applied={
                    task.autoTaskApplication &&
                    task.autoTaskApplication.some(
                      (application) => application.userId === Number(user?.id)
                    )
                  }
                  claimed={
                    task.autoTaskApplication &&
                    task.autoTaskApplication.some(
                      (application) =>
                        application.userId === Number(user?.id) && application.isConfirmed
                    )
                  }
                  createdAt={task.createdAt}
                  icon={getIconByTaskId(task.id)}
                  category={task.isIntegrated ? 'ref' : 'default'}
                  refLink={refData?.refLink}
                />
              ))}
            </Flex>
          </Flex>
        </Flex>

            {/* <Card >
              <Grid gap='4'>
                <Heading mr='3'>More</Heading>

                <AccentButton onClick={() => navigate('/become-partner')} size='4'>
                  Become Advertiser
                </AccentButton>
              </Grid>
            </Card> */}
          </Box>
        </Flex>
      </ScrollArea>
    </Box>
  );
}
