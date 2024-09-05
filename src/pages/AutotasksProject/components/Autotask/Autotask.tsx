import { Card, Flex, IconButton, Text } from '@radix-ui/themes';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { CheckOutlined, RocketOutlined } from '@ant-design/icons';
import { ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useApplyForAutotask } from '../../../../shared/utils/api/hooks/autotasks/useApplyForAutotask';
import { useClaimReward } from '../../../../shared/utils/api/hooks/autotasks/useClaimReward';
import { AutotaskApplicationDTO } from 'api';
import { calculateTimeLeft } from '../../../../shared/utils/helpers/calculateTimeLeft';
import { showToastWithPromise } from '../../../../shared/utils/helpers/notify';
import { getAutotaskApplications } from '../../../../shared/utils/api/requests/autotasks/getAutotaskApplications';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../shared/utils/redux/store';
import { AxiosResponse } from 'axios';
import { Sheet } from 'react-modal-sheet';
import '../../../../styles/CustomSheetsStyles.css';
import styles from './Autotask.module.css';

interface AutotaskProps {
  id: number;
  title: string;
  description: string;
  price: number;
  createdAt?: string;
  children?: ReactNode;
  userId: number;
  claimed: boolean;
  done: boolean;
}

const AutotaskCard: FC<AutotaskProps> = ({
  id,
  title,
  description,
  price,
  children,
  userId,
  done,
  claimed,
  createdAt,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isApplied, setApplied] = useState(done);
  const [isRewardClaimed, setIsRewardClaimed] = useState(claimed);
  const [isTimerStarted, setTimerStarted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(claimed);
  const [timeLeft, setTimeLeft] = useState(0);
  const [applicationInfo, setApplicationInfo] = useState<AutotaskApplicationDTO>();

  const mutation = useApplyForAutotask(setTimeLeft, setApplicationInfo);
  const claimReward = useClaimReward();

  useEffect(() => {
    if (createdAt) {
      const timeLeftCalculated = calculateTimeLeft(createdAt);
      setTimeLeft(timeLeftCalculated);
    }
    setApplied(done);
    setIsRewardClaimed(claimed);
    setIsBlocked(claimed || isTimerStarted);
  }, [isModalVisible, done, claimed, createdAt]);

  useEffect(() => {
    if (timeLeft > 0) {
      setTimerStarted(true);
      setIsBlocked(true);
    } else {
      setTimerStarted(false);
      setIsBlocked(false);
    }
  }, [timeLeft]);

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (isBlocked && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(timer!);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [isBlocked, timeLeft]);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleSendApplication = () => {
    setApplied(true);
    mutation.mutate({ params: { title, description, reward: price, taskId: id, userId } });
    setTimeLeft(120);
  };

  const fetchApplicationInfo = async (): Promise<
    AxiosResponse<AutotaskApplicationDTO[]> | undefined
  > => {
    if (user) {
      return await showToastWithPromise({
        success: 'Application info fetched successfully',
        process: 'Fetching application info',
        error: 'Error while fetching application info',
        callback: () => getAutotaskApplications({ params: { userId: parseInt(user.id) } }),
      });
    } else {
      return undefined;
    }
  };

  const handleClaimReward = async () => {
    if (!applicationInfo && user) {
      const applicationInfoResponse = await fetchApplicationInfo();

      if (applicationInfoResponse && applicationInfoResponse.data.length > 0) {
        setApplicationInfo(applicationInfoResponse.data[0]);

        if (applicationInfoResponse.data[0]) {
          setIsRewardClaimed(true);
          setIsBlocked(true);
          claimReward.mutate({
            params: { userId, applicationId: applicationInfoResponse.data[0].id },
          });
        }
      }
    } else if (applicationInfo) {
      setIsRewardClaimed(true);
      setIsBlocked(true);
      claimReward.mutate({ params: { userId, applicationId: applicationInfo.id } });
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card
      className='SubtaskCard'
      mb='3'
      style={
        isApplied
          ? { width: '100%', border: '2px solid green' }
          : { width: '100%', border: '1px solid yellow' }
      }
    >
      <Flex align='center' justify='between'>
        <Flex>
          {isRewardClaimed ? (
            <CheckOutlined style={{ color: 'green', marginRight: '15px', fontSize: '24px' }} />
          ) : (
            <RocketOutlined style={{ color: 'yellow', marginRight: '15px', fontSize: '24px' }} />
          )}

          <Flex direction='column'>
            <Text size='5' weight='medium'>
              {title}
            </Text>
            <Text weight='medium'>
              <Text color='yellow'>Price:</Text> {price}$
            </Text>
          </Flex>
        </Flex>

        <IconButton onClick={handleDialogOpen}>
          <ChevronRightIcon></ChevronRightIcon>
        </IconButton>

        <Sheet isOpen={isModalVisible} onClose={() => handleDialogClose()} detent='content-height'>
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              {
                <div className={styles.content}>
                  <div className={styles.information}>
                    <h2 className={styles.title}>
                      🚀<span className={styles.accent}>Subtask:</span> {title}
                    </h2>
                    <p className={styles.description}>{description}</p>
                    <>{children}</>
                  </div>

                  <button
                    style={{ marginBottom: '10px' }}
                    className={isBlocked ? 'ProposalButtonDisabled' : 'ProposalButton'}
                    disabled={isBlocked}
                    onClick={!isApplied ? handleSendApplication : handleClaimReward}
                  >
                    <Text>
                      {isTimerStarted && timeLeft > 0
                        ? `Time left: ${formatTime(timeLeft)}`
                        : isApplied
                          ? 'Claim Reward'
                          : 'Check!'}
                    </Text>
                  </button>
                </div>
              }
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop />
        </Sheet>
      </Flex>
    </Card>
  );
};

export default AutotaskCard;
