import { Button, Flex, AlertDialog } from '@radix-ui/themes';
import Select, { SingleValue } from 'react-select';
import { PROJECT_STATUSES } from '../../../shared/consts/project-statuses';
import { CUSTOM_SELECT_STYLES_SINGLE } from '../../../styles/customSelectStyles';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDeleteProject } from '../../../shared/utils/api/hooks/project/useDeleteProject';
import { Option } from '../../../@types/app';
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
  const navigate = useNavigate();
  const [currentStatus, setCurrentStatus] = useState<ProjectStatus>(projectStatus);
  const deleteProjectMutation = useDeleteProject();
  const updateProjectStatus = useUpdateProjectStatus(projectId);

  const handleStatusChange = (status: SingleValue<Option>) => {
    if (status) {
      const statusValue = status.value as ProjectStatus;
      setCurrentStatus(statusValue);
    }
  };

  const handleChangeStatusClick = () => {
    updateProjectStatus.mutate({ params: { id: projectId, payload: { status: currentStatus } } });
  };

  return (
    <Flex direction='column'>
      <Select
        onChange={handleStatusChange}
        placeholder='Select status'
        closeMenuOnSelect={true}
        options={PROJECT_STATUSES}
        styles={CUSTOM_SELECT_STYLES_SINGLE}
        value={currentStatus}
        isMulti={false}
      />

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button style={{ marginTop: '20px', marginBottom: '20px' }}>Change status</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth='450px'>
          <AlertDialog.Title>Delete project</AlertDialog.Title>
          <AlertDialog.Description size='2'>
            Are you sure? Status 'deleted' deletes the project. This action is permanent and cannot
            be undone.
          </AlertDialog.Description>

          <Flex gap='3' mt='4' justify='end'>
            <AlertDialog.Cancel>
              <Button variant='soft' color='gray'>
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={handleChangeStatusClick} variant='solid' color='red'>
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
