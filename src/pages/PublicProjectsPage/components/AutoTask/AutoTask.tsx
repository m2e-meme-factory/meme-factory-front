import { Button, Card, Flex, IconButton, Text } from '@radix-ui/themes';
import React, { Dispatch, FC, SetStateAction, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { RocketOutlined } from '@ant-design/icons';
import { ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';

interface AutotaskProps {
  title: string;
  description: string;
  price: number;
  setAutoTaskDone: Dispatch<SetStateAction<boolean>>;
}

const AutotaskCard: FC<AutotaskProps> = ({ title, description, price, setAutoTaskDone }) => {
  const [isModalVisible, setModalVisible] = useState(false);
  const [isApplied, setApplied] = useState(false);

  const handleSendProposalClick = () => {
    setApplied(true);
    setAutoTaskDone(true);
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
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
          <Dialog.Trigger asChild>
            <IconButton onClick={handleDialogOpen}>
              <ChevronRightIcon />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='DialogOverlay' />
            <Dialog.Content className='DialogContent'>
              <Dialog.Title className='DialogTitle Accent'>
                <span>Subtask: {title}</span>
              </Dialog.Title>
              <Dialog.Description className='DialogDescription'>
                <Text>{description}</Text>
              </Dialog.Description>
              <button
                className={isApplied ? 'ProposalButtonDisabled' : 'ProposalButton'}
                disabled={isApplied}
                onClick={handleSendProposalClick}
              >
                <Text>Done!</Text>
              </button>
              <Dialog.Close asChild>
                <button onClick={handleDialogClose} className='IconButton' aria-label='Close'>
                  <Cross1Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </Flex>
    </Card>
  );
};

export default AutotaskCard;
