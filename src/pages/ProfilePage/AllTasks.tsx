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
  SegmentedControl,
  Select,
} from '@radix-ui/themes';
import { useAuthMe } from '../../shared/utils/api/hooks/auth/useAuthMe';
import { setUser } from '../../shared/utils/redux/user/userSlice';
import GlowingButton, { AccentButton } from '../../shared/components/Buttons/GlowingButton';
import styled from 'styled-components';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { Sheet } from 'react-modal-sheet';
import { showErrorMessage, showSuccessMessage } from '../../shared/utils/helpers/notify';
import { RootState } from '../../shared/utils/redux/store';
import { getIconByTaskId } from '../../shared/utils/helpers/getIconByTaskId';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import CoinbagAnimated from '../../shared/components/LottieIcons/Coinbag/CoinbagAnimated';
import { InfoCircleOutlined } from '@ant-design/icons';
import yeyEmoji from '../../shared/imgs/yey.png';
import { ROUTES } from '../../shared/consts/routes';
import Header from './Header';
import { SolidCard } from '../../shared/components/Card/SolidCard';
import AutotaskCardDefaults from '../AutotasksProject/components/Autotask/AutotaskCardDefaults';
import { useTonConnectUI } from '@tonconnect/ui-react';
import BorderButton from '../../shared/components/Buttons/BorderButton';
import YellowBorderButton from '../../shared/components/Buttons/YellowBorderButton';

const NftCard = styled(SolidCard) <{ glowing: boolean }>`
  height: 25vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: ease .2s;
  --card-border-width: 0;

  &:active {
    cursor: pointer;
    transform: scale(0.8)
  }
  color: ${(props) => props.glowing ? "black" : "auto"};
  background: ${(props) => props.glowing ? "var(--brand-color)" : "#1c1c1e url(../imgs/ellipse.svg) no-repeat top right / cover"};
  filter: ${(props) => props.glowing ? "" : "filter: blur(119.19999694824219px);"};
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


const ImgWrapper = styled(Flex) <{ opacity: number }>`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`

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


interface Task {
  category: string;
  completed: boolean;
}

export default function AllTasks() {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);
  const { data: refData, isLoading: refLoading } = useGetRefData(user?.telegramId);
  const { data: userDataResponse, isLoading: userDataLoading } = useAuthMe();
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


  const [tasks, setTasks] = useState<Task[]>([
    { category: 'wallet', completed: tonConnectUI.connected },
    { category: 'checkin', completed: false },
    { category: 'welcome-bonus', completed: false },
    { category: 'shere-in-stories', completed: false },
    { category: 'account-bio', completed: false },
  ]);

  // Загрузка состояния задач из localStorage при монтировании компонента
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks && savedTasks?.length > 0) {
      console.log("load tasks")
      setTasks(JSON.parse(savedTasks));
    }
    else {
      console.log("new tasks")
      setTasks([
        { category: 'wallet', completed: tonConnectUI.connected },
        { category: 'checkin', completed: false },
        { category: 'welcome-bonus', completed: false },
        { category: 'shere-in-stories', completed: false },
        { category: 'account-bio', completed: false },
      ])
    }
  }, []);

  
  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
        if (wallet) {
          markTaskAsCompleted('wallet');
        } 
    });

    return () => unsubscribe();
}, [tonConnectUI]);


  // Функция для отметки задачи выполненной
  const markTaskAsCompleted = (category: string) => {
    const newtasks = tasks.map((task) =>
        task.category === category ? { ...task, completed: true } : task
    )
    
    setTasks(newtasks)
      
    localStorage.setItem('tasks', JSON.stringify(newtasks));
  };

  return (
    <Box height="90vh">


      {/* <ScrollArea> */}
      <Flex asChild p="4" gap="6" direction="column">
        <Box pt='3' pb="3" style={{ maxHeight: '100%' }}>
          <Flex direction='column' gap='4'>
            <Header />
            <Box>
              <Grid gap='4'>
                <Grid gap='3' columns="2">
                  <NftCard onClick={() => navigate(ROUTES.POST_MEME)} glowing={true}>
                    <Box>
                      <ImgWrapper opacity={1}>
                        <img
                          src={`${process.env.PUBLIC_URL}/imgs/posting.png`}
                          style={{
                            width: '32px',
                            height: '35px',
                          }}
                        />
                      </ImgWrapper>
                      <Heading size='3'>Post Meme</Heading>
                      <Text>Earn Money</Text>
                    </Box>
                    <BorderButton size='4' >
                      start posting
                    </BorderButton>
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
                        />
                      </ImgWrapper>
                      <Heading size='3'>Get Review</Heading>
                      <Text color='gray' size='2'>
                        Meme reached 10K views, get Reward
                      </Text>
                    </Box>
                    <YellowBorderButton size='4' style={{ height: '32px'}}>
                      get
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
                      <Grid gap='8' mb='5' p="4" align='center'>
                        <Flex justify='center'>
                          <CoinbagAnimated />
                        </Flex>
                        <Flex direction='column' gap='2'>
                          <Card onClick={() => navigate(ROUTES.POST_MEME)}>
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
                                    You get 1 <Badge color='bronze'>XP</Badge> for each 1 view as reward
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
                                  <Box>Send link to Moderation</Box>
                                  <Box>
                                    <Text size='1' color='gray'>
                                      Wait unitl it gets as much views as possible, because you can send video on review only once
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
                          onClick={() => {
                            webapp.openLink('https://t.me/mf_sup_bot');
                          }}
                          style={{ width: '100%' }}
                        >
                          Get Reward
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
            <Heading weight='bold' size='4'>Fast Tasks</Heading>

            <Flex direction='column' mb='5'>
              <Flex align='center' mb='4'>
                <Text weight='light' size='3' color='gray'>
                  You'll be rewarded immediately with XP after each task completion
                </Text>
              </Flex>
              <Flex justify='center' direction='column' gap='3'>
                {tasks.length > 0 && (
                  <>
                  
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      title={"Welcome bonus"}
                      description={""}
                      // description={"Thanks for joining Meme Factory"}
                      price={"5000"}
                      userId={Number(user?.id)}
                      applied={tasks[2].completed}
                      claimed={tasks[2].completed}
                      category={"welcome-bonus"}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      title={"Connect Wallet"}
                      description={"Secure your account by connecting your wallet to start earning rewards."}
                      price={"5000"}
                      userId={Number(user?.id)}
                      applied={tasks[0].completed}
                      claimed={tasks[0].completed}
                      category={"wallet"}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      title={"Daily check-in"}
                      description={"Log in every day to claim your reward and keep your streak alive."}
                      price={"1000"}
                      userId={Number(user?.id)}
                      applied={tasks[1].completed}
                      claimed={tasks[1].completed}
                      category={"checkin"}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      refLink={refData?.refLink}
                      title={"Share in Stories"}
                      description={""}
                      // description={"Share your invite link in your instagram stories to spread the word and earn rewards."}
                      price={"10000"}
                      userId={Number(user?.id)}
                      applied={tasks[3].completed}
                      claimed={tasks[3].completed}
                      category={"shere-in-stories"}
                    />
                    <AutotaskCardDefaults
                      markTaskCompleted={markTaskAsCompleted}
                      refLink={refData?.refLink}
                      title={"Edit account info"}
                      description={""}
                      // description={"Update your instagram account information to keep your profile current and earn rewards."}
                      price={"10000"}
                      userId={Number(user?.id)}
                      applied={tasks[4].completed}
                      claimed={tasks[4].completed}
                      category={"account-bio"}
                    />
                  </>
                )}

              </Flex>
            </Flex>
          </Flex>

        </Box>
      </Flex>
      {/* </ScrollArea> */}
    </Box>
  );
}
