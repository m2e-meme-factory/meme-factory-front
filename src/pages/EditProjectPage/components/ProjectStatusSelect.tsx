import { Button, Flex, AlertDialog, Heading } from '@radix-ui/themes';
import React, { FC } from 'react';
import { useUpdateProjectStatus } from '../../../shared/utils/api/hooks/project/useUpdateProjectStatus';

enum ProjectStatus {
  DRAFT = 'draft',
  MODERATION = 'moderation',
  PUBLISHED = 'published',
  NOT_ACCEPTED = 'not_accepted',
  CLOSED = 'closed',
}

interface ProjectStatusSelect {
  projectId: string;
  projectStatus: ProjectStatus;
}

const ProjectStatusSelect: FC<ProjectStatusSelect> = ({ projectId, projectStatus }) => {
  const updateProjectStatus = useUpdateProjectStatus(projectId);

  const handleSendOnModeration = () => {
    updateProjectStatus.mutate({ params: { id: projectId, payload: { status: ProjectStatus.MODERATION } } });
  }

  const handleProjectDelete = () => {
    updateProjectStatus.mutate({ params: { id: projectId, payload: { status: ProjectStatus.CLOSED } } });
  }

  return (
    <Flex direction='column'>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button mt='2' style={{ padding: '20px' }}>Send on moderation</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth='450px'>
          <AlertDialog.Title>Send on moderation</AlertDialog.Title>
          <AlertDialog.Description size='2'>
            Are you sure? The project will be unavailable for editing once sent on moderation.
          </AlertDialog.Description>

          <Flex gap='3' mt='4' justify='end'>
            <AlertDialog.Cancel>
              <Button variant='soft' color='gray'>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={handleSendOnModeration} variant='solid' color='yellow'>
                Submit
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color='red' mt='2' style={{ padding: '20px' }}>Delete project</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth='450px'>
          <AlertDialog.Title>Close project</AlertDialog.Title>
          <AlertDialog.Description size='2'>
            Are you sure? This action is permanent and cannot
            be undone.
          </AlertDialog.Description>

          <Flex gap='3' mt='4' justify='end'>
            <AlertDialog.Cancel>
              <Button variant='soft' color='gray'>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={handleProjectDelete} variant='solid' color='red'>
                Change status
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  );
};

export default ProjectStatusSelect;
