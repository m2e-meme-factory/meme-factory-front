import { Button, Card, Flex, Text, Tooltip } from '@radix-ui/themes';
import React, { FC, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { Cross2Icon } from '@radix-ui/react-icons';
import './index.css';
import { RocketOutlined } from '@ant-design/icons';
import ModalSubtaskInfo from './ModalSubtaskInfo';
import ModalSubtaskForm from './ModalSubtaskForm';
import { UserRoleInProject } from '../../ProjectPage';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  userRole: UserRoleInProject;
}

const SubtaskCard: FC<TaskCardProps> = ({ id, title, description, price, userRole }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const proposeBtnClassname = userRole !== 'member' ? 'ProposalButtonDisabled' : 'ProposalButton';

  const handleSendProposalClick = () => {
    setIsFormVisible(!isFormVisible);
  };

  const handleDialogClose = () => {
    setModalVisible(false);
    setIsFormVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  return (
    <Dialog.Root open={isModalVisible}>
      <Dialog.Trigger asChild>
        <Card className='SubtaskCard' mb='3' onClick={handleDialogOpen}>
          <Flex>
            <RocketOutlined style={{ color: 'yellow', marginRight: '15px' }} />
            <Flex direction='column'>
              <Text size='5' weight='medium'>
                {title}
              </Text>
              <Text weight='medium'>
                <Text color='yellow'>Price:</Text> {price}$
              </Text>
            </Flex>
          </Flex>
        </Card>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className='DialogOverlay' />
        <Dialog.Content className='DialogContent'>
          <Dialog.Title className='DialogTitle Accent'>
            <span>Subtask: {title}</span>
          </Dialog.Title>
          {isFormVisible ? (
            <>
              <ModalSubtaskForm closeDialog={handleDialogClose} />
            </>
          ) : (
            <>
              <ModalSubtaskInfo id={id} title={title} description={description} price={price} />
              {userRole !== 'advertiser' &&
                (userRole !== 'member' ? (
                  <Tooltip content='Join the project to apply for the tasks'>
                    <button className={proposeBtnClassname} onClick={handleSendProposalClick}>
                      <Text>Send Proposal</Text>
                    </button>
                  </Tooltip>
                ) : (
                  <button className={proposeBtnClassname} onClick={handleSendProposalClick}>
                    <Text>Send Proposal</Text>
                  </button>
                ))}
            </>
          )}
          <Dialog.Close asChild>
            <button onClick={handleDialogClose} className='IconButton' aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default SubtaskCard;
