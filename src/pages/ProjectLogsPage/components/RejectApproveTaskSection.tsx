import { Button, Dialog, Flex, TextArea } from '@radix-ui/themes';
import React, { Dispatch, FC, useState } from 'react';
import { useApproveTaskCompletion } from '../../../shared/utils/api/hooks/task/useApproveTaskCompletion';
import { useRejectTaskCompletion } from '../../../shared/utils/api/hooks/task/useRejectTaskCompletion';

interface RejectApproveSectionProps {
  taskId?: number;
  setNewEventCreated: Dispatch<React.SetStateAction<boolean>>;
  userId: number;
  showButtons: boolean;
}

const RejectApproveTaskSection: FC<RejectApproveSectionProps> = ({
  taskId,
  setNewEventCreated,
  userId,
  showButtons,
}) => {
  const [approveMessage, setApproveMessage] = useState('');
  const [taskApproved, setTaskApproved] = useState(false);

  const [rejectMessage, setRejectMessage] = useState('');
  const [taskRejected, setTaskRejected] = useState(false);

  const approveMutation = useApproveTaskCompletion(setNewEventCreated, setTaskApproved);
  const rejectMutation = useRejectTaskCompletion(setNewEventCreated, setTaskRejected);

  const handleApproveTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setApproveMessage(event.target.value);
  };

  const handleApprove = () => {
    if (approveMessage && taskId) {
      approveMutation.mutate({
        params: { taskId: taskId, message: approveMessage, creatorId: userId },
      });
    }
  };

  const handleReject = () => {
    if (rejectMessage && taskId) {
      rejectMutation.mutate({
        params: { taskId: taskId, message: rejectMessage, creatorId: userId },
      });
    }
  };

  const handleRejectTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejectMessage(event.target.value);
  };

  return (
    <>
      {showButtons && (
        <Flex direction='column'>
          {!taskApproved && !taskRejected && (
            <>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant='outline' color='green' mt='2'>
                    Approve
                  </Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth='450px'>
                  <Dialog.Title>Approving the task completion</Dialog.Title>

                  <Flex direction='column' gap='3'>
                    <TextArea
                      onChange={handleApproveTextareaChange}
                      value={approveMessage}
                      placeholder='Enter message'
                    ></TextArea>
                  </Flex>

                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='gray'>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button onClick={handleApprove} variant='soft' color='green'>
                        Approve
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
              <Dialog.Root>
                <Dialog.Trigger>
                  <Button variant='outline' color='red' mt='2'>
                    Reject
                  </Button>
                </Dialog.Trigger>

                <Dialog.Content maxWidth='450px'>
                  <Dialog.Title>Rejecting the task completion</Dialog.Title>

                  <Flex direction='column' gap='3'>
                    <TextArea
                      onChange={handleRejectTextareaChange}
                      value={rejectMessage}
                      placeholder='Enter message'
                    ></TextArea>
                  </Flex>

                  <Flex gap='3' mt='4' justify='end'>
                    <Dialog.Close>
                      <Button variant='soft' color='gray'>
                        Cancel
                      </Button>
                    </Dialog.Close>
                    <Dialog.Close>
                      <Button onClick={handleReject} variant='soft' color='red'>
                        Reject
                      </Button>
                    </Dialog.Close>
                  </Flex>
                </Dialog.Content>
              </Dialog.Root>
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default RejectApproveTaskSection;
