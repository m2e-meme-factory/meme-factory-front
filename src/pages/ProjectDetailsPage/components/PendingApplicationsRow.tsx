import { Button, Flex, Table, Text } from '@radix-ui/themes';
import React, { FC } from 'react';
import ApplyButtonModal from './ApplyButtonModal';
import RejectButtonModal from './RejectButtonModal';
import { useNavigate } from 'react-router-dom';
import { ProjectProgress, User } from 'api';

interface PendingApplicationsRowProps {
  progressId: string;
  name: string;
  progress: ProjectProgress;
  user: User;
}

const PendingApplicationsRow: FC<PendingApplicationsRowProps> = ({
  name,
  progressId,
  progress,
  user,
}) => {
  const navigate = useNavigate();
  return (
    <Table.Row>
      <Table.Cell>
        <Flex mt='2'>
          <Text>{name}</Text>
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <Button onClick={() => navigate(`/projects/${progress.projectId}/logs/${user.id}`)}>
          Read message
        </Button>
      </Table.Cell>
      <Table.Cell>
        <Flex>
          <ApplyButtonModal progressId={progressId} />
          <RejectButtonModal progressId={progressId} />
        </Flex>
      </Table.Cell>
    </Table.Row>
  );
};

export default PendingApplicationsRow;
