import { Button, Dialog, Flex, IconButton, TextArea } from '@radix-ui/themes';
import React, { FC, useState } from 'react';
import { Cross2Icon } from '@radix-ui/react-icons';
import { useRejectApplication } from '../../../shared/utils/api/hooks/project/useRejectApplication';

interface RejectButtonModal {
  progressId: string | undefined;
}

const RejectButtonModal: FC<RejectButtonModal> = ({ progressId }) => {
  const [rejectLoading, setRejectLoading] = useState(false);
  const [rejectMessage, setRejectMessage] = useState('');

  const mutationReject = useRejectApplication(setRejectLoading);

  const handleAccept = () => {
    setRejectLoading(true);
    mutationReject.mutate({
      params: { progressId: progressId ? progressId : '', message: rejectMessage },
    });
  };

  const handleTextAreaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setRejectMessage(event.target.value);
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <IconButton mb='2' ml='2'>
          <Cross2Icon />
        </IconButton>
      </Dialog.Trigger>

      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>Accepting application</Dialog.Title>

        <Flex direction='column' gap='3'>
          <TextArea
            onChange={handleTextAreaChange}
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
            <Button loading={rejectLoading} onClick={handleAccept} variant='soft' color='red'>
              Reject
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default RejectButtonModal;
