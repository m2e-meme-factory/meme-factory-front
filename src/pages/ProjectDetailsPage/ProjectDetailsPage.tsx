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
import FreelancersStats from './components/FreelancersStats';
import PendingApplications from './components/PendingApplications';

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
        <Flex align='center' justify='between'>
          <Heading>Actions:</Heading>
          <Button size='3' onClick={() => navigate(`/projects/${id}`)}>
            <MagnifyingGlassIcon />
            View Project Page
          </Button>
          <Button size='3' onClick={() => navigate(`/projects/${id}/edit`)}>
            <Pencil1Icon />
            Edit Project
          </Button>
        </Flex>
      </Card>

      <Heading mt='5'>Pending applications</Heading>
      <PendingApplications />

      <Heading mt='5'>Active freelancers</Heading>
      <FreelancersStats />
    </Flex>
  );
};

export default ProjectDetailsPage;
