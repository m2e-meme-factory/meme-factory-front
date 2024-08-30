import { Card, Flex, Text, Dialog, IconButton } from '@radix-ui/themes';
import React, { FC, ReactNode, useState, useEffect } from 'react';
import { RocketOutlined } from '@ant-design/icons';
import { ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';
import { useApplyForAutotask } from '../../../../shared/utils/api/hooks/autotasks/useApplyForAutotask';
import { useClaimReward } from '../../../../shared/utils/api/hooks/autotasks/useClaimReward';
import { AutotaskApplicationDTO } from 'api';

interface AutotaskProps {
  id: number;
  title: string;
  description: string;
  price: number;
  children?: ReactNode;
  userId: number;
}

const AutotaskCard: FC<AutotaskProps> = ({ id, title, description, price, children, userId }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isApplied, setApplied] = useState(false);
  const [timerStarted, setTimerStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [applicationInfo, setApplicationInfo] = useState<AutotaskApplicationDTO>();
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);

  const mutation = useApplyForAutotask(setTimeLeft, setApplicationInfo);
  const claimReward = useClaimReward();

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (timerStarted && timeLeft > 0) {
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
  }, [timerStarted, timeLeft]);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleSendApplicationClick = () => {
    if (!isApplied) {
      setApplied(true);
      mutation.mutate({ params: { title, description, reward: price, taskId: id, userId } });
      setTimerStarted(true);
    }
    if (!isRewardClaimed && isApplied && applicationInfo && timeLeft === 0) {
      claimReward.mutate({ params: { userId, applicationId: applicationInfo.id } });
      setIsRewardClaimed(true);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <Card className='SubtaskCard' mb='3' style={{ width: '100%', border: '1px solid yellow' }}>
      <Flex align='center' justify='between'>
        <Flex>
          <RocketOutlined style={{ color: 'yellow', marginRight: '15px', fontSize: '24px' }} />
          <Flex direction='column'>
            <Text size='5' weight='medium'>
              {title}
            </Text>
            <Text weight='medium'>
              <Text color='yellow'>Price:</Text> {price}$
            </Text>
          </Flex>
        </Flex>

        <Dialog.Root open={isModalVisible}>
          <Dialog.Trigger>
            <IconButton onClick={handleDialogOpen}>
              <ChevronRightIcon />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Title className='Accent'>
              <span>Subtask: {title}</span>
            </Dialog.Title>
            <Dialog.Description>
              <Text>{description}</Text>
              <div style={{ margin: '10px' }} />
              <div>{children}</div>
            </Dialog.Description>

            <button
              style={{ marginTop: '10px' }}
              className={isApplied ? 'ProposalButtonDisabled' : 'ProposalButton'}
              disabled={isApplied}
              onClick={handleSendApplicationClick}
            >
              <Text>
                {timerStarted && timeLeft > 0
                  ? `Time left: ${formatTime(timeLeft)}`
                  : isApplied
                    ? 'Claim Reward'
                    : 'Check!'}
              </Text>
            </button>
            <Dialog.Close>
              <button onClick={handleDialogClose} className='IconButton' aria-label='Close'>
                <Cross1Icon />
              </button>
            </Dialog.Close>
          </Dialog.Content>
        </Dialog.Root>
      </Flex>
    </Card>
  );
};

export default AutotaskCard;
