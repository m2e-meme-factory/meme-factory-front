import { Badge, Box, Callout, Card, Flex, Heading, Spinner, Text, Theme } from '@radix-ui/themes';
import React, { FC, ReactNode, useEffect, useState } from 'react';
import { showErrorMessage, showSuccessMessage } from '../../../../shared/utils/helpers/notify';
import { Sheet } from 'react-modal-sheet';
import '../../../../styles/CustomSheetsStyles.css';
import { CaretRightIcon, CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import CopyableRef from '../CopyableField/CopyableRef';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getAutotaskApplications } from '../../../../shared/utils/api/requests/autotask/getAutotaskApplications';
import { applyAutotaskCompletion } from '../../../../shared/utils/api/requests/autotask/applyForAutotaskCompletion';
import { claimAutotaskReward } from '../../../../shared/utils/api/requests/autotask/claimAutotaskReward';
import styles from '../../../../shared/components/SocialsLink/SocialsLink.module.css';
import { UNSUBSCRIBE_WARNING } from '../../../../shared/consts/strings';
import { getSocialsNameByTaskId } from '../../../../shared/utils/helpers/getSocialsNameByTaskId';
import { AxiosError } from 'axios';
import { SolidCard } from '../../../../shared/components/Card/SolidCard';

interface AutotaskProps {
  id: number;
  title: string;
  description: string;
  price: string;
  createdAt?: string;
  children?: ReactNode;
  url: string | null;
  icon?: ReactNode;
  userId: number;
  claimed: boolean;
  applied: boolean;
  refLink?: string;
  category: 'ref' | 'default';
}

const AutotaskCard: FC<AutotaskProps> = ({
  id,
  title,
  description,
  price,
  children,
  userId,
  applied,
  claimed,
  icon,
  url,
  refLink,
  category,
}) => {
  //State of autotask
  type ApplicationStatus = 'applied' | 'claimed' | 'unstarted';
  const [isApplied, setIsApplied] = useState(applied);
  const [isClaimed, setIsClaimed] = useState(claimed);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(
    isApplied ? (isClaimed ? 'claimed' : 'applied') : 'unstarted'
  );

  useEffect(() => {
    setApplicationStatus(isApplied ? (isClaimed ? 'claimed' : 'applied') : 'unstarted');
  }, [isApplied, isClaimed]);

  //Card styles
  type CardStyles = Record<'applied' | 'claimed' | 'unstarted', string>;
  const cardStyles: CardStyles = {
    applied: '2px solid #e8c020',
    claimed: '2px solid #45a951',
    unstarted: '2px solid var(--gray-10)',
  };

  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({
    border: cardStyles[applicationStatus as ApplicationStatus],
    borderRadius: '20px',
    padding: '10px 7px',
  });

  useEffect(() => {
    setCardStyle({
      border: cardStyles[applicationStatus as ApplicationStatus],
      borderRadius: '20px',
      padding: '10px 7px',
    });
  }, [applicationStatus]);

  //Modal controls
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  // Autotask application
  const {
    data: application,
    isLoading: applicationLoading,
    refetch: refetchApplication,
  } = useQuery({
    queryFn: () => getAutotaskApplications({ params: { userId: userId, taskId: id } }),
    queryKey: ['autotaskApplication', userId, id],
    enabled: applied,
    select: (data) => data.data[0],
  });

  useEffect(() => {
    if (application) {
      const status: ApplicationStatus = application.isConfirmed ? 'claimed' : 'applied';
      setApplicationStatus(status);
    }
  }, [application]);

  const [submitting, setSubmitting] = useState(false);

  //Apply for autotask
  const { mutate: apply, isPending: isApplying } = useMutation({
    mutationFn: applyAutotaskCompletion,
    onError: () => {
      showErrorMessage('Error occurred while applying autotask completion');
      setSubmitting(false);
    },
    onSuccess: () => {
      setTimeout(() => {
        setSubmitting(false);
        setIsApplied(true);
      }, 11000);
    },
    onSettled: () => {
      setTimeout(() => {
        setSubmitting(false);
        refetchApplication();
      }, 11000);
    },
  });

  //Claim reward
  const { mutate: claim, isPending: isClaiming } = useMutation({
    mutationFn: claimAutotaskReward,
    onError: (error: AxiosError) => {
      const response = error.response?.data as {
        error: string;
        message: string;
        statusCode: number;
      };
      if (response) {
        showErrorMessage(response.message || 'An unknown error occurred');
      } else {
        showErrorMessage('An unknown error occurred');
      }
    },
    onSuccess: () => {
      setIsClaimed(true);
      showSuccessMessage('Reward claimed successfully!');
    },
    onSettled: () => {
      refetchApplication();
    },
  });

  const handleApplyClick = () => {
    if (applicationStatus === 'unstarted' && !submitting) {
      setSubmitting(true);
      apply({ params: { taskId: id } });
    }
  };

  const handleClaimClick = () => {
    if (isClaiming && applicationStatus === 'applied') return;

    claim({ params: { taskId: id } });
  };

  return (
    <SolidCard className='SubtaskCard'  style={cardStyle} onClick={handleDialogOpen}>
      <Flex align='center' justify='between' pl='2' pr='2'>
        <Flex>
          {icon}

          <Flex direction='column' ml='4'>
            <Text size='4' weight='medium' style={{ userSelect: 'text' }}>
              {title}
            </Text>
            <Text weight='medium' size='3' color='gray'>
              <i>
                +{price} <Badge color='bronze'>XP</Badge>
              </i>
            </Text>
          </Flex>
        </Flex>

        {isClaimed ? (
          <CheckIcon color='#45a951' width={20} height={20} />
        ) : (
          <CaretRightIcon width={20} height={20} />
        )}

        <Sheet isOpen={isModalVisible} onClose={() => handleDialogClose()} detent='content-height'>
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <Theme>
                <Flex m='4' gap='2' direction='column'>
                  <Flex mb='5' mt='4' direction={'column'} gap='2'>
                    <Heading align='center' style={{ userSelect: 'text' }}>
                      {title}
                    </Heading>
                    <Flex justify='center'>
                      <Badge
                        size='3'
                        color={isApplied ? (isClaimed ? 'green' : 'yellow') : 'gray'}
                        variant='soft'
                      >
                        {applicationStatus}
                      </Badge>
                    </Flex>
                    <Text align='center' color='gray'>
                      <i>
                        +{price} <Badge color='bronze'>XP</Badge>
                      </i>
                    </Text>
                  </Flex>
                  {category === 'ref' && (
                    <Box mb='4'>
                      <CopyableRef refLink={refLink || 'test'} />
                    </Box>
                  )}

                  <Callout.Root color='gray' mb={category === 'ref' ? '8' : '4'}>
                    <Callout.Icon>
                      <InfoCircledIcon width={20} height={20} />
                    </Callout.Icon>
                    <Callout.Text style={{ userSelect: 'text' }}>{description}</Callout.Text>
                  </Callout.Root>
                  {category !== 'ref' && (
                    <Flex>
                      <Flex direction='column' gap='2'>
                        {isApplied && isClaimed ? (
                          <a
                            href={url ?? ''}
                            target='_blank'
                            className={styles.link}
                            onClick={handleApplyClick}
                          >
                            <div className={styles.card}>
                              <div className={styles.cardContent}>
                                <div className={styles.websiteInfo}>
                                  {icon}
                                  <p className={styles.socialsName}>{title}</p>
                                </div>
                                <CheckIcon color='#45a951' width={20} height={20} />
                              </div>
                            </div>
                          </a>
                        ) : isApplied ? (
                          <div className={styles.card} onClick={handleClaimClick}>
                            <div className={styles.cardContent}>
                              <Flex justify='center' align='center' style={{ width: '100%' }}>
                                <p className={styles.socialsName}>Claim</p>
                              </Flex>
                            </div>
                          </div>
                        ) : (
                          <a
                            href={url ?? ''}
                            target='_blank'
                            className={styles.link}
                            onClick={handleApplyClick}
                          >
                            <div className={styles.card}>
                              <div className={styles.cardContent}>
                                {submitting || isClaiming ? (
                                  <div className={styles.card}>
                                    <div className={styles.cardContent}>
                                      <Flex
                                        justify='center'
                                        align='center'
                                        style={{ width: '100%' }}
                                      >
                                        <Spinner></Spinner>
                                      </Flex>
                                    </div>
                                  </div>
                                ) : (
                                  <>
                                    <div className={styles.websiteInfo}>
                                      {icon}
                                      <p className={styles.socialsName}>{title}</p>
                                    </div>
                                    <CaretRightIcon width={20} height={20} />
                                  </>
                                )}
                              </div>
                            </div>
                          </a>
                        )}
                        <p className={styles.warning}>{UNSUBSCRIBE_WARNING}</p>
                      </Flex>
                    </Flex>
                  )}
                </Flex>
              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Sheet>
      </Flex>
    </SolidCard>
  );
};

export default AutotaskCard;
