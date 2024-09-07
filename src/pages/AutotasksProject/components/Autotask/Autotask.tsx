import { Card, Flex, Text } from '@radix-ui/themes';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
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
import SocialsLink from '../../../../shared/components/SocialsLink/SocialsLink';
import { getIconByTaskId } from '../../../../shared/utils/helpers/getIconByTaskId';

interface AutotaskProps {
  id: number;
  title: string;
  description: string;
  price: number;
  createdAt?: string;
  children?: ReactNode;
  url?: string;
  icon?: ReactNode;
  category: string;
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
  icon,
  category,
  url,
}) => {
  const user = useSelector((state: RootState) => state.user.user);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isApplied, setApplied] = useState(done);
  const [isRewardClaimed, setIsRewardClaimed] = useState(claimed);
  const [isTimerStarted, setTimerStarted] = useState(false);
  const [isBlocked, setIsBlocked] = useState(claimed);
  const [timeLeft, setTimeLeft] = useState(0);
  const [applicationInfo, setApplicationInfo] = useState<AutotaskApplicationDTO>();
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});

  const mutation = useApplyForAutotask(setApplicationInfo, setTimeLeft);
  const claimReward = useClaimReward();

  useEffect(() => {
    if (createdAt) {
      const timeLeftCalculated = calculateTimeLeft(createdAt);
      setTimeLeft(timeLeftCalculated);
    }
    if (!isApplied) {
      setApplied(done);
    }
    if (!isRewardClaimed) {
      setIsRewardClaimed(claimed);
    }
    setIsBlocked(claimed || isTimerStarted);
  }, [isModalVisible, done, claimed, createdAt]);

  useEffect(() => {
    const newStyle: React.CSSProperties = {
      borderRadius: '20px',
      padding: '10px 7px',
      border: isApplied ? '2px solid green' : '2px solid gray',
    };
    setCardStyle(newStyle);
  }, [isApplied]);

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
    mutation.mutate({
      params: { title, description, reward: price, taskId: id, userId, isIntegrated: false },
    });
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

  useEffect(() => {
    console.log(isBlocked);
  }, [isBlocked]);

  return (
    <Card className='SubtaskCard' mb='3' style={cardStyle} onClick={handleDialogOpen}>
      <Flex align='center' justify='between'>
        <Flex>
          {icon}

          <Flex direction='column'>
            <Text size='4' weight='medium'>
              {title}
            </Text>
            <Text weight='medium' size='3' color='gray'>
              +{price} M2E
            </Text>
          </Flex>
        </Flex>

        {isRewardClaimed ? (
          <CheckOutlined style={{ color: 'green', fontSize: '20px', marginRight: '10px' }} />
        ) : (
          <RightOutlined style={{ color: '#fecf0a', fontSize: '20px', marginRight: '10px' }} />
        )}

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
                    <div className={styles.linkContainer}>
                      <h3>Your task:</h3>
                      {url && (
                        <SocialsLink icon={getIconByTaskId(id)} socialsName={category} url={url} />
                      )}
                    </div>
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
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Sheet>
      </Flex>
    </Card>
  );
};

export default AutotaskCard;
