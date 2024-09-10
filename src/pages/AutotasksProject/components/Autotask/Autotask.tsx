import { Badge, Button, Callout, Card, Flex, Heading, Text, Theme } from '@radix-ui/themes';
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
import { CaretRightIcon, CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import CopyableRef from '../CopyableField/CopyableRef';
import CopyableTextField from '../../../../shared/components/CopyableTextField';

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
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      border: isApplied ? '2px solid #45a951' : '2px solid var(--gray-10)',
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
    if (isSubmitting) return;
    setIsSubmitting(true);

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

    setIsSubmitting(false);
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
      <Flex align='center' justify='between' pl='2' pr='2'>
        <Flex>
          {icon}

          <Flex direction='column'>
            <Text size='4' weight='medium'>
              {title}
            </Text>
            <Text weight='medium' size='3' color='gray'>
              <i>
                +{price} <Badge color='gold'>M2E</Badge>
              </i>
            </Text>
          </Flex>
        </Flex>

        {isRewardClaimed ? (
          <CheckIcon color='#45a951' width={20} height={20} />
        ) : (
          // <CheckOutlined style={{ color: 'green', fontSize: '20px', marginRight: '10px' }} />
          <CaretRightIcon width={20} height={20} />
          // <RightOutlined style={{ fontSize: '20px', marginRight: '10px' }} />
        )}

        <Sheet isOpen={isModalVisible} onClose={() => handleDialogClose()} detent='content-height'>
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <Theme>
                {
                  <Flex m='4' gap='2' direction='column'>
                    {/* <Text>{description}</Text> */}
                    <Flex mb='5' mt='4' direction={'column'} gap='2'>
                      <Heading align='center'>{title}</Heading>
                      <Flex justify='center'>
                        <Badge size='3' color={isApplied ? 'yellow' : 'gray'} variant='soft'>
                          {isTimerStarted && timeLeft > 0
                            ? `On approve`
                            : isApplied
                              ? 'Approved'
                              : 'Pending'}
                        </Badge>
                      </Flex>
                      <Text align='center' color='gray'>
                        <i>
                          +{price} <Badge color='bronze'>M2E</Badge>
                        </i>
                      </Text>
                    </Flex>
                    <Callout.Root color='gray' mb='4'>
                          <Callout.Icon>
                            <InfoCircledIcon width={20} height={20} />
                          </Callout.Icon>
                          <Callout.Text>{description}asasd</Callout.Text>
                        </Callout.Root>
                    {url && (
                      <SocialsLink icon={getIconByTaskId(id)} socialsName={category} url={url} />
                    )}
                    {category == 'referral' && (
                      <>
                        
                        <Text color='gray'>Your Ref link:</Text>
                        <CopyableTextField
                          size={'2'}
                          fieldSize='3'
                          value={'https://t.me/bot?start='}
                        />
                      </>
                    )}
                    {category != 'referral' && (
                      <>
                        <Button
                          mb='2'
                          size='4'
                          className={isBlocked ? 'ProposalButtonDisabled' : 'ProposalButton'}
                          disabled={isBlocked}
                          onClick={!isApplied ? handleSendApplication : handleClaimReward}
                        >
                          {isTimerStarted && timeLeft > 0
                            ? `Time left: ${formatTime(timeLeft)}`
                            : isApplied
                              ? 'Claim Reward'
                              : 'Check!'}
                        </Button>
                      </>
                    )}
                  </Flex>
                }
                {/* {
                  <div className={styles.content}>
                    <div className={styles.information}>
                      <h2 className={styles.title}>
                        🚀 {title}
                      </h2>
                      <p className={styles.description}>{description}</p>
                      <div className={styles.linkContainer}>
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
                } */}
              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Sheet>
      </Flex>
    </Card>
  );
};

export default AutotaskCard;
