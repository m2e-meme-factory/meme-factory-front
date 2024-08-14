import { ScrollArea, Table } from '@radix-ui/themes';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FreelancersStats = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <ScrollArea type='always' scrollbars='vertical' style={{ height: 'fit-content' }}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tasks done</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Income</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row onClick={() => navigate('/projects/1/logs/1')}>
            <Table.Cell>Danilo Sousa</Table.Cell>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>$20000</Table.Cell>
          </Table.Row>
          <Table.Row onClick={() => navigate('/projects/1/logs/1')}>
            <Table.Cell>Danilo Sousa</Table.Cell>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>$20000</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  );
};

export default FreelancersStats;
