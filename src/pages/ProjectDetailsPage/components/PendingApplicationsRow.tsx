import { Button, Flex, Table, Text } from '@radix-ui/themes';
import React, { FC } from 'react';
import ApplyMessageReadModal from './ApplyMessageReadModal';
import ApplyButtonModal from './ApplyButtonModal';
import RejectButtonModal from './RejectButtonModal';
import { useNavigate } from 'react-router-dom';
import { ProjectProgress } from 'api';

interface PendingApplicationsRowProps {
  progressId: string;
  name: string;
  progress: ProjectProgress;
}

const PendingApplicationsRow: FC<PendingApplicationsRowProps> = ({
  name,
  progressId,
  progress,
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
        <Button
          onClick={() => navigate(`/projects/${progress.projectId}/logs/${progress.user.id}`)}
        >
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
