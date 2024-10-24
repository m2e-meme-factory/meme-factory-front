import {
  Badge,
  Box,
  Button,
  Callout,
  Card,
  Flex,
  Heading,
  Text,
  TextArea,
  Theme,
  Tooltip,
} from '@radix-ui/themes';
import { Sheet, SheetRef } from 'react-modal-sheet';
import '../../../../styles/CustomSheetsStyles.css';
import { CaretRightIcon, CheckIcon, InfoCircledIcon } from '@radix-ui/react-icons';
import React, { useEffect, useRef, useState } from 'react';
import { UserRoleInProject } from '../../ProjectPage';
import { ProjectProgress } from 'api';
import { useApplyTaskCompletion } from '../../../../shared/utils/api/hooks/task/useApplyTaskCompletion';
import './index.css';

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

const SheetSubtaskCard = ({
  title,
  description,
  price,
  id,
  progress,
  userRole,
}: SheetSubtaskCardProps) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [status, setStatus] = useState<TaskStatus>('uncompleted');
  const applyTaskCompletionMutation = useApplyTaskCompletion();
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [textareaValue, setTextareaValue] = useState('');
  const ref = useRef<SheetRef>();
  const snapTo = (i: number) => ref.current?.snapTo(i);

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

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  const handleSubmit = () => {
    applyTaskCompletionMutation.mutate({ params: { taskId: id, message: textareaValue } });
    handleDialogClose();
  };

  return (
    <Card asChild className='SubtaskCard' onClick={handleDialogOpen}>
      <Box p='2'>
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

          {status === 'approved' ? (
            <Button color='green' variant='outline'>
              Complete again
              <CheckIcon color='#45a951' width={20} height={20} />
            </Button>
          ) : (
            <Button variant='outline'>
              {userRole === 'projectMember' ? 'Start' : 'View'}
              <CaretRightIcon width={20} height={20} />
            </Button>
          )}
          <Sheet
            isOpen={isModalVisible}
            onClose={() => handleDialogClose()}
            detent='full-height'
            snapPoints={[1, 0.8, 0]}
            initialSnap={1}
            ref={ref}
          >
            <Theme appearance='dark'>
              <Sheet.Container>
                <Sheet.Header />
                <Sheet.Content>
                  <Theme style={{ width: '100%', paddingBottom: '40px' }}>
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

                      {(status === 'uncompleted' ||
                        status === 'rejected' ||
                        status === 'approved') &&
                        userRole !== 'projectOwner' &&
                        userRole !== 'guestAdvertiser' && (
                          <Flex direction='column' gap='5'>
                            <Flex direction='column' gap='3'>
                              <Text>Cover Letter</Text>
                              <TextArea
                                mb='10'
                                maxLength={500}
                                onBlur={() => snapTo(1)}
                                onFocus={() => snapTo(0)}
                                onChange={(e) => {
                                  setTextareaValue(e.target.value);
                                }}
                              />
                            </Flex>
                            {userRole === 'projectMember' && (
                              <Button
                                onClick={() => handleSubmit()}
                                style={{ height: '40px', fontSize: '18px' }}
                              >
                                Submit
                              </Button>
                            )}
                            {(userRole === 'unconfirmedMember' || userRole === 'guestCreator') && (
                              <Tooltip content='Join the project to apply for the task'>
                                <Button
                                  disabled={true}
                                  style={{ height: '40px', fontSize: '18px' }}
                                >
                                  Submit
                                </Button>
                              </Tooltip>
                            )}
                          </Flex>
                        )}
                    </Flex>
                  </Theme>
                </Sheet.Content>
              </Sheet.Container>
              <Sheet.Backdrop onTap={() => handleDialogClose()} />
            </Theme>
          </Sheet>
        </Flex>
      </Box>
    </Card>
  );
};

export default SheetSubtaskCard;
