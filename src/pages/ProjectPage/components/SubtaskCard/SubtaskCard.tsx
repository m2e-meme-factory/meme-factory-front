import { Box, Card, Flex, IconButton, Spinner, Text, Tooltip } from '@radix-ui/themes';
import React, { FC, useState, useEffect } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { CheckOutlined, CloseOutlined, RocketOutlined } from '@ant-design/icons';
import './index.css';
import ModalSubtaskInfo from './ModalSubtaskInfo';
import ModalSubtaskForm from './ModalSubtaskForm';
import { UserRoleInProject } from '../../ProjectPage';
import { ProjectProgress } from 'api';
import { ChevronRightIcon, Cross1Icon } from '@radix-ui/react-icons';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  price: number;
  userRole: UserRoleInProject;
  progress: ProjectProgress | undefined;
}

const SubtaskCard: FC<TaskCardProps> = ({ id, title, description, price, userRole, progress }) => {
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isApplied, setApplied] = useState(false);
  const [isApproved, setApproved] = useState(false);
  const [isRejected, setRejected] = useState(false);

  useEffect(() => {
    if (progress) {
      const taskId = Number.parseInt(id);
      setApplied(progress.appliedTasks.includes(taskId));
      setApproved(progress.approvedTasks.includes(taskId));
      setRejected(progress.rejectedTasks.includes(taskId));
    }
  }, [progress, id]);

  const proposeBtnClassname =
    userRole === 'guestCreator' || userRole === 'guestAdvertiser'
      ? 'ProposalButton'
      : 'ProposalButtonDisabled';

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

  if (
    !progress &&
    userRole !== 'guestAdvertiser' &&
    userRole !== 'guestCreator' &&
    userRole !== 'projectOwner'
  ) {
    return (
      <Card className='SubtaskCard' mb='3' onClick={handleDialogOpen}>
        <Flex justify='between' align='center'>
          <Flex>
            <RocketOutlined style={{ color: 'yellow', marginRight: '15px', fontSize: '24px' }} />
            <Flex direction='column'>
              <Box
                mb='2'
                width='180px'
                height='2vh'
                style={{ backgroundColor: 'gray', borderRadius: '4px' }}
              />
              <Box
                width='64px'
                height='2vh'
                style={{ backgroundColor: 'gray', borderRadius: '4px' }}
              />
            </Flex>
          </Flex>
          <Spinner mr='3' />
        </Flex>
      </Card>
    );
  }

  return (
    <Card className='SubtaskCard' mb='3' onClick={handleDialogOpen}>
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
            <IconButton>
              <ChevronRightIcon />
            </IconButton>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className='DialogOverlay' />
            <Dialog.Content className='DialogContent'>
              <Dialog.Title className='DialogTitle Accent'>
                <span>Subtask: {title}</span>
              </Dialog.Title>
              {isFormVisible ? (
                <ModalSubtaskForm
                  taskId={id}
                  progress={progress}
                  closeDialog={handleDialogClose}
                  setIsApplied={setApplied}
                />
              ) : (
                <>
                  <ModalSubtaskInfo id={id} title={title} description={description} price={price} />
                  {userRole !== 'projectOwner' &&
                    userRole !== 'guestAdvertiser' &&
                    userRole !== 'guestCreator' && (
                      <button
                        className={
                          isApplied || isApproved ? 'ProposalButtonDisabled' : 'ProposalButton'
                        }
                        disabled={isApplied || isApproved}
                        onClick={handleSendProposalClick}
                      >
                        <Text>Send Proposal</Text>
                      </button>
                    )}
                  {(userRole === 'guestAdvertiser' || userRole === 'guestCreator') && (
                    <Tooltip content='Join the project to apply for the tasks'>
                      <button
                        className='ProposalButtonDisabled'
                        disabled={true}
                        onClick={handleSendProposalClick}
                      >
                        <Text>Send Proposal</Text>
                      </button>
                    </Tooltip>
                  )}
                </>
              )}
              <Dialog.Close asChild>
                <button onClick={handleDialogClose} className='IconButton' aria-label='Close'>
                  <Cross1Icon />
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
        {isApproved && <CheckOutlined style={{ color: 'green', marginRight: '15px' }} />}
        {isRejected && <CloseOutlined style={{ color: 'red', marginRight: '15px' }} />}
      </Flex>
    </Card>
  );
};

export default SubtaskCard;
