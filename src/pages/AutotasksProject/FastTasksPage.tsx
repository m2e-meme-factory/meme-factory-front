import { useCallback, useEffect } from 'react';
import { Flex, Heading, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';

import AutotaskCard from './components/Autotask/Autotask';

import { useGetRefData } from '@shared/utils/api/hooks/user/useGetRefData';
import { RootState } from '@shared/utils/redux/store';
import Loading from '@shared/components/Loading';
import { getIconByTaskId } from '@shared/utils/helpers/getIconByTaskId';
import { getAllAutotasks } from '@shared/utils/api/requests/autotask/getAllAutotasks';
import { LOCAL_TEXT } from '@shared/consts';

import styles from '../ProjectPage/ProjectPage.module.css';

const FastTasksPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Telegram back button
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

  // Current user data
  const user = useSelector((state: RootState) => state.user.user);

  //Fetching ref data
  const { data: refData, isLoading: refLoading } = useGetRefData(user?.telegramId);

  //Fetching tasks
  const { data: autotasks, isLoading: autotasksLoading } = useQuery({
    queryFn: () => getAllAutotasks({}),
    queryKey: ['autotasks', user?.id],
    select: (data) => data.data,
  });

  const autotasksLoading1 = false;
  const autotasks1 = [
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

  if (autotasksLoading || refLoading) {
    return <Loading />;
  }

  return (
    <Flex direction='column'>
      <Flex className={styles.content} direction='column' gap='6'>
        <Flex m='4' direction='column' gap='2'>
          <Heading weight='bold'>{t(LOCAL_TEXT.FAST_TASKS)}</Heading>

          <Flex direction='column' mb='5'>
            <Flex align='center' mb='4'>
              <Text weight='light' size='3' color='gray'>
                {t(LOCAL_TEXT.YOU_REWARDED_IMMEDIATELY_WITH_M2E_POINTS_AFTER_EACH_TASK_COMPLETION)}
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
      </Flex>
    </Flex>
  );
};

export default FastTasksPage;
