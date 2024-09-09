import { Button, Dialog, Flex, IconButton, TextArea } from '@radix-ui/themes';
import React, { FC, useState } from 'react';
import { CheckIcon } from '@radix-ui/react-icons';
import { useAcceptApplication } from '../../../shared/utils/api/hooks/project/useApproveApplication';

interface ApplyButtonModalProps {
  progressId: string | undefined;
}

const ApplyButtonModal: FC<ApplyButtonModalProps> = ({ progressId }) => {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [acceptMessage, setAcceptMessage] = useState('');

  const mutationAccept = useAcceptApplication(setAcceptLoading, false);

  const handleAccept = () => {
    setAcceptLoading(true);
    mutationAccept.mutate({
      params: { progressId: progressId ? progressId : '', message: acceptMessage },
    });
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAcceptMessage(event.target.value);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton mb='2'>
          <CheckIcon />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>Accepting application</Dialog.Title>

        <Flex direction='column' gap='3'>
          <TextArea
            onChange={handleTextAreaChange}
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
            <Button loading={acceptLoading} onClick={handleAccept} variant='soft' color='yellow'>
              Accept
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplyButtonModal;
