import React, { FC, ReactNode, useEffect, useState } from 'react';
import { Card, Flex, Text } from '@radix-ui/themes';
import { CheckOutlined, RightOutlined } from '@ant-design/icons';
import { Sheet } from 'react-modal-sheet';
import styles from './Autotask.module.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../shared/utils/redux/store';
import { AutotaskApplicationDTO, CreateAutotaskApplicationDTO, RefDataResponse } from 'api';
import { useApplyForAutotask } from '../../../../shared/utils/api/hooks/autotasks/useApplyForAutotask';
import { useClaimReward } from '../../../../shared/utils/api/hooks/autotasks/useClaimReward';
import { useGetRefData } from '../../../../shared/utils/api/hooks/user/useGetRefData';
import { showErrorMessage, showToastWithPromise } from '../../../../shared/utils/helpers/notify';
import { AxiosResponse } from 'axios';
import { getAutotaskApplications } from '../../../../shared/utils/api/requests/autotasks/getAutotaskApplications';

interface IntegratedAutotaskProps {
  id: number;
  title: string;
  description: string;
  price: number;
  children?: ReactNode;
  icon?: ReactNode;
  userId: number;
  claimed: boolean;
  done: boolean;
}

const IntegratedAutotask: FC<IntegratedAutotaskProps> = ({
  id,
  title,
  description,
  price,
  children,
  userId,
  done,
  claimed,
  icon,
}) => {
  const user = useSelector((state: RootState) => state.user.user);

  const [isModalVisible, setModalVisible] = useState(false);
  const [isApplied, setApplied] = useState(done);
  const [isRewardClaimed, setIsRewardClaimed] = useState(claimed);
  const [isBlocked, setIsBlocked] = useState(claimed);
  const [isConditionCompleted, setConditionCompleted] = useState<boolean>();
  const [applicationInfo, setApplicationInfo] = useState<AutotaskApplicationDTO>();
  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({});
  const [refData, setRefData] = useState<RefDataResponse>();

  const applyMutation = useApplyForAutotask(setApplicationInfo);
  const claimReward = useClaimReward();

  const { data: refDataResponse, refetch } = useGetRefData(user?.telegramId);

  useEffect(() => {
    if (refDataResponse) {
      setRefData(refDataResponse.data);
    }
  }, [refDataResponse]);

  useEffect(() => {
    if (refData) {
      setConditionCompleted(refData.count > 0);
    }
  }, [refData]);

  useEffect(() => {
    const updateTaskState = async () => {
      if (!isApplied) {
        setApplied(done);
      }
      if (!isRewardClaimed) {
        setIsRewardClaimed(claimed);
      }
      if (!isBlocked) {
        setIsBlocked(claimed);
      }

      const newStyle: React.CSSProperties = {
        borderRadius: '20px',
        padding: '10px 7px',
        border: isApplied ? '2px solid green' : '2px solid gray',
      };
      setCardStyle(newStyle);

      await handleRefetch();
    };

    updateTaskState();
  }, [isModalVisible, done, claimed]);

  useEffect(() => {
    const newStyle: React.CSSProperties = {
      borderRadius: '20px',
      padding: '10px 7px',
      border: isApplied ? '2px solid green' : '2px solid gray',
    };
    setCardStyle(newStyle);
  }, [isApplied]);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleCheckAndApply = async () => {
    setApplied(true);
    if (!isConditionCompleted) {
      setIsBlocked(true);
    }
    const autotaskApplicationDTO: CreateAutotaskApplicationDTO = {
      title,
      description,
      reward: price,
      taskId: id,
      userId: userId,
      isIntegrated: true,
    };

    applyMutation.mutate({ params: autotaskApplicationDTO });
    await handleRefetch();
  };

  useEffect(() => {
    if (typeof isConditionCompleted === 'boolean') {
      setIsBlocked(!isConditionCompleted);
    }
  }, [isConditionCompleted]);

  const handleRefetch = async () => {
    try {
      await refetch();
      if (refData) {
        setConditionCompleted((refData?.count ?? 0) > 0);
      }
    } catch (error) {
      console.error('Error refetching data:', error);
      showErrorMessage('Failed to fetch ref data');
    }
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
              <div className={styles.content}>
                <div className={styles.information}>
                  <h2 className={styles.title}>
                    🚀<span className={styles.accent}>Subtask:</span> {title}
                  </h2>
                  <p className={styles.description}>{description}</p>
                  {children}
                </div>

                {!isApplied ? (
                  <button
                    style={{ marginBottom: '10px' }}
                    className='ProposalButton'
                    onClick={handleCheckAndApply}
                  >
                    <Text>Check!</Text>
                  </button>
                ) : (
                  <button
                    style={{ marginBottom: '10px' }}
                    className={isBlocked ? 'ProposalButtonDisabled' : 'ProposalButton'}
                    disabled={isBlocked}
                    onClick={handleClaimReward}
                  >
                    <Text>Claim Reward!</Text>
                  </button>
                )}
              </div>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Sheet>
      </Flex>
    </Card>
  );
};

export default IntegratedAutotask;
