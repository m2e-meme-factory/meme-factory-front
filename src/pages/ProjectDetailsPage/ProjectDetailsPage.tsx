import { Button, Card, Flex, Table, Heading, IconButton, Text, ScrollArea } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import {
  ArrowLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  Pencil1Icon,
} from '@radix-ui/react-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProject } from '../../shared/utils/api/hooks/project/useGetProject';
import { Project } from 'api';
import { setProject } from '../../shared/utils/redux/project/projectSlice';
import { useDispatch } from 'react-redux';
import Loading from '../../shared/components/Loading';

const ProjectDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, error, refetch: refetchProject } = useGetProject(id);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);

  useEffect(() => {
    if (currentProject) {
      dispatch(setProject(currentProject));
    }
  }, [currentProject]);

  useEffect(() => {
    if (data) {
      setCurrentProject(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <IconButton mr='3' onClick={() => navigate(-1)}>
          <ArrowLeftIcon />
        </IconButton>
        <Heading>Project details</Heading>
      </Flex>

      <Card mt='5'>
        <Flex justify='between' align='center'>
          <Flex direction='column'>
            <Text mb='2' color='gray'>
              Total spendings
            </Text>
            <Heading>$26 412.03</Heading>
          </Flex>
          <Button>
            <ChevronRightIcon /> Transactions
          </Button>
        </Flex>
      </Card>

      <Card mt='5'>
        <Heading mb='3'>Actions</Heading>
        <Flex align='center' justify='between'>
          <Button m='1' size='3' onClick={() => navigate(`/projects/${id}`)}>
            <MagnifyingGlassIcon />
            View Project Page
          </Button>
          <Button m='1' size='3' onClick={() => navigate(`/projects/${id}/edit`)}>
            <Pencil1Icon />
            Edit Project
          </Button>
        </Flex>
      </Card>

      <Heading mt='5'>Freelancers</Heading>
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
              <Table.RowHeaderCell onClick={() => navigate('/about')}>
                Danilo Sousa
              </Table.RowHeaderCell>
              <Table.Cell>1</Table.Cell>
              <Table.Cell>$20000</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </ScrollArea>
    </Flex>
  );
};

export default ProjectDetailsPage;
