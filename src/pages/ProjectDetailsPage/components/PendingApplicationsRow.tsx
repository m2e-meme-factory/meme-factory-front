import { Flex, Table, Text } from '@radix-ui/themes';
import React, { FC } from 'react';
import ApplyMessageReadModal from './ApplyMessageReadModal';
import ApplyButtonModal from './ApplyButtonModal';
import RejectButtonModal from './RejectButtonModal';

interface PendingApplicationsRowProps {
  progressId: string;
  name: string;
  message: string;
}

const PendingApplicationsRow: FC<PendingApplicationsRowProps> = ({ name, message, progressId }) => {
  return (
    <Table.Row>
      <Table.Cell>
        <Flex mt='2'>
          <Text>{name}</Text>
        </Flex>
      </Table.Cell>
      <Table.Cell>
        <ApplyMessageReadModal message={message} />
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
