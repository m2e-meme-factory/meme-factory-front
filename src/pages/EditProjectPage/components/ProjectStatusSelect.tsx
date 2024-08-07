import { Button, Flex, AlertDialog } from '@radix-ui/themes';
import Select, { SingleValue } from 'react-select';
import { PROJECT_STATUSES } from '../../../shared/consts/project-statuses';
import { CUSTOM_SELECT_STYLES_SINGLE } from '../../../styles/customSelectStyles';
import React, { FC, useState } from 'react';
import { Option } from '../../../@types/app';
import { useNavigate } from 'react-router-dom';
import { useDeleteProject } from '../../../shared/utils/api/hooks/project/useDeleteProject';
import { useDispatch } from 'react-redux';

interface ProjectStatusSelect {
  projectId: string;
}

const ProjectStatusSelect: FC<ProjectStatusSelect> = ({projectId}) => {
  const navigate = useNavigate();
  const [projectStatus, setProjectStatus] = useState<string>('active');
  const deleteProjectMutation = useDeleteProject();

  const handleStatusChange = (status: SingleValue<Option>) => {
    if (status) {
      setProjectStatus(status.value);
    }
  }

  const handleChangeStatusClick = () => {
    if (projectStatus === 'deleted') {
      deleteProjectMutation.mutate({params: projectId})
      navigate('/projects');
    }
  }

  return (
    <Flex direction='column'>
      <Select
        onChange={handleStatusChange}
        placeholder='Select status'
        closeMenuOnSelect={true}
        options={PROJECT_STATUSES}
        styles={CUSTOM_SELECT_STYLES_SINGLE}
        value={projectStatus}
        isMulti={false}
      />

      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button style={{marginTop: '20px', marginBottom: '20px'}}>Change status</Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Delete project</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? Status 'deleted' deletes the project. This action is permanent and
            cannot be undone.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button onClick={handleChangeStatusClick} variant="solid" color="red">
                Change status
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </Flex>
  )
}

export default ProjectStatusSelect;