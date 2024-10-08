import { useEffect } from 'react';
import { Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import styles from '../ProjectPage/ProjectPage.module.css';
import AutotaskCard from './components/Autotask/Autotask';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import Loading from '../../shared/components/Loading';
import CopyableRef from './components/CopyableField/CopyableRef';
import { getIconByTaskId } from '../../shared/utils/helpers/getIconByTaskId';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getAllAutotasks } from '../../shared/utils/api/requests/autotask/getAllAutotasks';

const FastTasksPage = () => {
  const navigate = useNavigate();

  // Telegram back button
  const webapp = useWebApp();

  useEffect(() => {
    webapp.ready();

    const backButton = webapp.BackButton;
    backButton.show();
    backButton.onClick(function () {
      backButton.hide();
    });

    const handleBack = () => {
      navigate(-1);
      backButton.hide();
    };

    webapp.onEvent('backButtonClicked', handleBack);
  }, [navigate, webapp]);

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

  if (autotasksLoading || refLoading) {
    return <Loading />;
  }

  return (
    <Flex direction='column'>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column' gap='2'>
          <Heading weight='bold'>Fast Tasks</Heading>

          <Flex direction='column' mb='5'>
            <Flex align='center' mb='4'>
              <Text weight='light' size='3' color='gray'>
                You'll be rewarded immediately with M2E points after each task completion
              </Text>
            </Flex>
            <Flex justify='center' direction='column' gap='2'>
              <AutotaskCard
                key={0}
                id={0}
                title={'Points for friends'}
                description={'Get 100 m2e for every friend'}
                price={'100'}
                children={<CopyableRef refLink={refData ? refData.refLink : ''} />}
                url={null}
                userId={parseInt(user?.id ?? '')}
                applied={(refData?.count || 0) > 0}
                claimed={(refData?.count || 0) > 0}
                createdAt={'2024-12-12T12:12:12.462Z'}
                icon={getIconByTaskId(0)}
                category={'ref'}
                refLink={refData?.refLink}
              />
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
                  icon={getIconByTaskId(0)}
                  category={'default'}
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
