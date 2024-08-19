import { ScrollArea, Table } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import { useGetProjectFreelancers } from '../../../shared/utils/api/hooks/project/useGetProjectFreelancers';
import { useParams } from 'react-router-dom';
import { FreelancersResponse, ProjectProgress } from 'api';
import PendingApplicationsRow from './PendingApplicationsRow';

const PendingApplications = () => {
  const { id } = useParams();
  const { data: pendingFreelancers, isLoading: isPFreelancersLoading } = useGetProjectFreelancers(
    id ? id : '',
    'pending'
  );

  const [pendingApplications, setPendingApplications] = useState<FreelancersResponse[]>();

  useEffect(() => {
    if (pendingFreelancers?.data) {
      setPendingApplications(pendingFreelancers.data);
    }
  }, [pendingFreelancers]);

  return (
    <ScrollArea type='always' scrollbars='vertical' style={{ height: 'fit-content' }}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Username</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Message</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {
            //todo: add messages
            pendingApplications &&
              pendingApplications.map((app) => {
                console.log(app);
                //const message = app.progress.events[0].message;
                return (
                  <PendingApplicationsRow
                    progressId={app.progress.id.toString()}
                    name={app.user.username ?? 'user'}
                    message={'message'}
                  />
                );
              })
          }
        </Table.Body>
      </Table.Root>
    </ScrollArea>
  );
};

export default PendingApplications;
