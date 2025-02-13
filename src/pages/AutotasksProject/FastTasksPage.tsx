import { Flex, Heading, Text } from '@radix-ui/themes';

import { useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';

import { useTranslation } from 'react-i18next';

import { useGetRefData } from '@shared/utils/api/hooks/user/useGetRefData';
import { RootState } from '@shared/utils/redux/store';
import Loading from '@shared/components/Loading';

import { getAllAutotasks } from '@shared/utils/api/requests/autotask/getAllAutotasks';
import { LOCAL_TEXT } from '@shared/consts';

import styles from '../ProjectPage/ProjectPage.module.css';

const FastTasksPage = () => {
  const { t } = useTranslation();

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
      <Flex className={styles.content} direction='column' gap='6'>
        <Flex m='4' direction='column' gap='2'>
          <Heading weight='bold'>{t(LOCAL_TEXT.FAST_TASKS)}</Heading>

          <Flex direction='column' mb='5'>
            <Flex align='center' mb='4'>
              <Text weight='light' size='3' color='gray'>
                {t(LOCAL_TEXT.YOU_REWARDED_IMMEDIATELY_WITH_M2E_POINTS_AFTER_EACH_TASK_COMPLETION)}
              </Text>
            </Flex>
            {/* <Flex justify='center' direction='column' gap='2'>
              {autotasks?.map((task) => {
                console.log('task', task);
                return (
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
                );
              })}
            </Flex> */}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default FastTasksPage;
