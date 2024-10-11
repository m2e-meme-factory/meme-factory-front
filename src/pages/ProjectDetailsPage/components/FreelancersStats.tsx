import { Button, ScrollArea, Table } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProjectFreelancers } from '../../../shared/utils/api/hooks/project/useGetProjectFreelancers';
import { FreelancersResponse } from 'api';

const FreelancersStats = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data: response } = useGetProjectFreelancers(id ? id : '', 'accepted');
  const [activeFreelancers, setActiveFreelancers] = useState<FreelancersResponse[]>([]);

  useEffect(() => {
    if (response) {
      setActiveFreelancers(response.data);
    }
  }, [response]);

  return (
    <ScrollArea type='always' scrollbars='vertical' style={{ height: 'fit-content' }}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Telegram Id</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>History</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {activeFreelancers.length > 0 &&
            activeFreelancers.map((responseItem) => (
              <Table.Row>
                <Table.Cell>{responseItem.user.username ?? '—'}</Table.Cell>
                <Table.Cell>{responseItem.user.telegramId}</Table.Cell>
                <Table.Cell>
                  <Button
                    onClick={() =>
                      navigate(
                        `/projects/${responseItem.progress.projectId}/logs/${responseItem.user.id}`
                      )
                    }
                  >
                    Show
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  );
};

export default FreelancersStats;
