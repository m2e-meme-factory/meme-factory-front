import React, { useEffect, useState } from 'react';
import { Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import styles from '../ProjectPage/ProjectPage.module.css';
import AutotaskCard from './components/Autotask/Autotask';
import { Autotask, tasks } from './tasks';
import { AutotaskApplicationDTO, RefDataResponse } from 'api';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { useGetAutotaskApplications } from '../../shared/utils/api/hooks/autotasks/useGetAutotaskApplications';
import Loading from '../../shared/components/Loading';
import CopyableRef from './components/CopyableField/CopyableRef';
import { getIconByTaskId } from '../../shared/utils/helpers/getIconByTaskId';
import IntegratedAutotask from './components/Autotask/IntegratedAutotask';

const AutoTasksProject = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [refData, setRefData] = useState<RefDataResponse>();
  const [autotasks, setAutotasks] = useState<Autotask[]>(tasks);
  const [doneTasksIds, setDoneTasksIds] = useState<Set<number>>(new Set<number>());
  const [claimedTasksIds, setClaimedTasksIds] = useState<Set<number>>(new Set<number>());
  const [applications, setApplications] = useState<AutotaskApplicationDTO[]>([]);

  const { data: refDataResponse, isLoading: refLoading } = useGetRefData(user?.telegramId);
  const { data: autotaskApplicationsResponse, isLoading: applicationsLoading } =
    useGetAutotaskApplications({ userId: parseInt(user?.id ?? '') });

  useEffect(() => {
    if (autotaskApplicationsResponse) {
      const applications = autotaskApplicationsResponse.data;
      setApplications(applications);
      applications.forEach((application) => {
        if (application.isConfirmed) {
          setClaimedTasksIds((prevState) => {
            const newSet = new Set(prevState);
            newSet.add(application.taskId);
            return newSet;
          });
        }
        setDoneTasksIds((prevState) => {
          const newSet = new Set(prevState);
          newSet.add(application.taskId);
          return newSet;
        });
      });
    }
  }, [autotaskApplicationsResponse, user]);

  useEffect(() => {
    if (!refLoading && refDataResponse) {
      setRefData(refDataResponse.data);
    }
  }, [refLoading, refDataResponse]);

  useEffect(() => {
    if (refData) {
      setAutotasks((prevState) =>
        prevState.map((task) => {
          if (task.id === 1) {
            return {
              ...task,
              children: <CopyableRef refLink={refData.refLink} />,
              icon: getIconByTaskId(task.id),
            };
          }
          return { ...task, icon: getIconByTaskId(task.id) };
        })
      );
    }
  }, [refData]);

  if (applicationsLoading) {
    return <Loading />;
  }

  return (
    <Flex direction='column'>
      <Flex className={styles.content} direction='column'>
        <Flex m='4' direction='column' gap='2'>
          <Heading weight='bold'>Tasks</Heading>

          <Flex direction='column' mb='5'>
            <Flex align='center' mb='4'>
              <Text weight='light' size='3' color='gray'>
                You'll be rewarded immediately with M2E points after each task completion
              </Text>
            </Flex>
            {refLoading ? (
              <Flex width='100vw' mt='2' align='center' justify='center'>
                <Spinner />
              </Flex>
            ) : (
              autotasks.map((task) =>
                (
                  <AutotaskCard
                    key={task.id}
                    id={task.id}
                    title={task.title}
                    description={task.description}
                    price={task.reward}
                    children={task.children}
                    url={task.url}
                    userId={parseInt(user?.id ?? '')}
                    done={doneTasksIds.has(task.id)}
                    claimed={claimedTasksIds.has(task.id)}
                    createdAt={
                      applications.find((application) => task.id === application.taskId)?.createdAt
                    }
                    icon={task.icon}
                    category={task.category}
                    refLink={refData?.refLink}
                  />
                )
              )
            )}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default AutoTasksProject;
