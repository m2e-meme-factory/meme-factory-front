import { ScrollArea, Table } from '@radix-ui/themes';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const FreelancersStats = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  return (
    <ScrollArea type='always' scrollbars='horizontal' style={{ height: 'fit-content' }}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Tasks done</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Income</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          <Table.Row>
            <Table.RowHeaderCell>Danilo Sousa</Table.RowHeaderCell>
            <Table.Cell>1</Table.Cell>
            <Table.Cell>$20000</Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  );
};

export default FreelancersStats;
