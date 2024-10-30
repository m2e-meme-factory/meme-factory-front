import { Button, Dialog, Flex, TextArea } from '@radix-ui/themes';
import React, { FC, useState } from 'react';
import { Event } from 'api';
import { useRejectApplication } from '../../../shared/utils/api/hooks/project/useRejectApplication';
import { useAcceptApplication } from '../../../shared/utils/api/hooks/project/useApproveApplication';

interface RejectAcceptApplicationSectionProps {
  progressId?: string;
}

const RejectAcceptApplicationSection: FC<RejectAcceptApplicationSectionProps> = ({
  progressId,
}) => {
  const [acceptMessage, setAcceptMessage] = useState('');
  const [applicationAccepted, setApplicationAccepted] = useState(false);

  const [rejectMessage, setRejectMessage] = useState('');
  const [applicationRejected, setApplicationRejected] = useState(false);

  const acceptMutation = useAcceptApplication(setApplicationAccepted, true);
  const rejectMutation = useRejectApplication(setApplicationRejected, true);

  const handleAcceptTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAcceptMessage(event.target.value);
  };

  const handleAccept = () => {
    if (acceptMessage && progressId) {
      acceptMutation.mutate({ params: { progressId: progressId, message: acceptMessage } });
    }
  };

  const handleReject = () => {
    if (rejectMessage && progressId) {
      rejectMutation.mutate({ params: { progressId: progressId, message: rejectMessage } });
    }
  };

  const handleRejectTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejectMessage(event.target.value);
  };

  return (
    <Flex direction='row' justify='between'>
      {!applicationAccepted && !applicationRejected && (
        <>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button color='green' mt='2' mx='1'>
                Accept
              </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth='450px'>
              <Dialog.Title>Accept Application</Dialog.Title>
              <Flex direction='column' gap='3'>
                <TextArea
                  onChange={handleAcceptTextareaChange}
                  value={acceptMessage}
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
                  <Button onClick={handleAccept} variant='soft' color='green'>
                    Accept
                  </Button>
                </Dialog.Close>
              </Flex>
            </Dialog.Content>
          </Dialog.Root>
          <Dialog.Root>
            <Dialog.Trigger>
              <Button variant='outline' color='red' mt='2' mx='1'>
                Reject
              </Button>
            </Dialog.Trigger>

            <Dialog.Content maxWidth='450px'>
              <Dialog.Title>Reject Application</Dialog.Title>
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
  );
};

export default RejectAcceptApplicationSection;
