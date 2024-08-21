import { Button, Dialog, Flex, ScrollArea, Text } from '@radix-ui/themes';
import React, { FC } from 'react';

interface ApplyMessageReadModalProps {
  message: string;
}

const ApplyMessageReadModal: FC<ApplyMessageReadModalProps> = ({ message }) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger>
        <Button mt='2' variant='ghost'>
          Read message
        </Button>
      </Dialog.Trigger>

      <Dialog.Content maxWidth='450px'>
        <Dialog.Title>Application message</Dialog.Title>

        <Flex direction='column' gap='3'>
          <ScrollArea type='always' scrollbars='vertical'>
            <Text>{message}</Text>
          </ScrollArea>
        </Flex>

        <Flex gap='3' mt='4' justify='end'>
          <Dialog.Close>
            <Button variant='soft' color='yellow'>
              Close
            </Button>
          </Dialog.Close>
        </Flex>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export default ApplyMessageReadModal;
