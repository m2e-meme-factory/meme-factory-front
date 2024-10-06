import {
  Badge,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Text,
  Theme,
  Tooltip,
} from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import '../../../../styles/CustomSheetsStyles.css';
import { CaretRightIcon, CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import React, { CSSProperties, useEffect, useState } from 'react';
import { UserRoleInProject } from '../../ProjectPage';
import { ProjectProgress } from 'api';
import * as Form from '@radix-ui/react-form';
import { useApplyTaskCompletion } from '../../../../shared/utils/api/hooks/task/useApplyTaskCompletion';

interface SheetSubtaskCardProps {
  title: string;
  description: string;
  price: number;
  id: string;
  userRole: UserRoleInProject;
  progress: ProjectProgress | undefined;
}

type TaskStatus = 'uncompleted' | 'approved' | 'rejected' | 'pending';

const STATUS_BADGE_COLOR: Record<TaskStatus, 'gray' | 'yellow' | 'red' | 'green'> = {
  uncompleted: 'gray',
  pending: 'yellow',
  rejected: 'red',
  approved: 'green',
};

const STATUS_BORDER_STYLE: Record<
  TaskStatus,
  '2px solid var(--gray-10)' | '2px solid #d5de2a' | '2px solid #852c2c' | '2px solid #45a951'
> = {
  uncompleted: '2px solid var(--gray-10)',
  pending: '2px solid #d5de2a',
  rejected: '2px solid #852c2c',
  approved: '2px solid #45a951',
};

const SheetSubtaskCard = ({
  title,
  description,
  price,
  id,
  progress,
  userRole,
}: SheetSubtaskCardProps) => {
  const [cardStyle, setCardStyle] = useState<CSSProperties>({});
  const [isRewardClaimed, setIsRewardClaimed] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState<TaskStatus>('uncompleted');
  const applyTaskCompletionMutation = useApplyTaskCompletion();

  useEffect(() => {
    if (!progress) {
      setStatus('uncompleted');
    } else if (progress.appliedTasks?.includes(Number(id))) {
      setStatus('pending');
    } else if (progress.rejectedTasks?.includes(Number(id))) {
      setStatus('rejected');
    } else if (progress.approvedTasks?.includes(Number(id))) {
      setStatus('approved');
    } else {
      setStatus('uncompleted');
    }
  }, [progress, id]);

  useEffect(() => {
    const newStyle: CSSProperties = {
      borderRadius: '20px',
      padding: '10px 7px',
      border: STATUS_BORDER_STYLE[status],
    };
    setCardStyle(newStyle);
  }, [status]);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const coverLetter = formData.get('cover-letter') as string;
    applyTaskCompletionMutation.mutate({ params: { taskId: id, message: coverLetter } });
    handleDialogClose();
  };

  console.log('Роль пользователя', userRole);

  return (
    <Card className='SubtaskCard' mb='3' style={cardStyle} onClick={handleDialogOpen}>
      <Flex align='center' justify='between' pl='2' pr='2'>
        <Flex>
          <Flex direction='column'>
            <Text size='4' weight='regular'>
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
          <CaretRightIcon width={20} height={20} />
        )}

        <Sheet isOpen={isModalVisible} onClose={() => handleDialogClose()} detent='content-height'>
          <Sheet.Container>
            <Sheet.Header />
            <Sheet.Content>
              <Sheet.Scroller style={{ width: '100%' }}>
                <Theme>
                  <Flex m='4' gap='2' direction='column'>
                    <Flex mb='5' mt='4' direction={'column'} gap='2'>
                      <Heading align='center'>{title}</Heading>
                      <Flex justify='center'>
                        <Badge size='3' color={STATUS_BADGE_COLOR[status]} variant='soft'>
                          {status}
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
                      <Callout.Text>{description}</Callout.Text>
                    </Callout.Root>

                    {status === 'uncompleted' &&
                      userRole !== 'projectOwner' &&
                      userRole !== 'guestAdvertiser' && (
                        <Form.Root className='FormRoot' onSubmit={handleSubmit}>
                          <Form.Field className='FormField' name='cover-letter'>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'baseline',
                                justifyContent: 'space-between',
                              }}
                            >
                              <Form.Label className='FormLabel'>Cover Letter</Form.Label>
                            </div>
                            <Form.Control asChild>
                              <textarea className='Textarea' required />
                            </Form.Control>
                            <Form.Message className='FormMessage' match='valueMissing'>
                              Please enter a cover letter
                            </Form.Message>
                            <Form.Message
                              className='FormMessage'
                              match={(value) => value.length <= 10}
                            >
                              Cover letter must be more than 10 characters
                            </Form.Message>
                          </Form.Field>
                          <Form.Submit asChild>
                            <Flex justify='center' style={{ width: '100%' }}>
                              {userRole === 'projectMember' && (
                                <button className='ProposalButton' style={{ marginTop: 10 }}>
                                  Submit
                                </button>
                              )}
                              {(userRole === 'unconfirmedMember' ||
                                userRole === 'guestCreator') && (
                                <Tooltip content='Join the project to apply for the task'>
                                  <button
                                    className='ProposalButtonDisabled'
                                    style={{ marginTop: 10 }}
                                  >
                                    Submit
                                  </button>
                                </Tooltip>
                              )}
                            </Flex>
                          </Form.Submit>
                        </Form.Root>
                      )}
                  </Flex>
                </Theme>
              </Sheet.Scroller>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Sheet>
      </Flex>
    </Card>
  );
};

export default SheetSubtaskCard;
