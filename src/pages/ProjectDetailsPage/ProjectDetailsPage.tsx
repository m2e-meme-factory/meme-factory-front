import { Button, Card, Flex, Heading, IconButton, Text } from '@radix-ui/themes';
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
import { useGetTotalSpending } from '../../shared/utils/api/hooks/project/useGetTotalSpending';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

const ProjectDetailsPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading } = useGetProject(id);
  const { data: totalSpendingsResponse, isLoading: totalSpendingsLoading } =
    useGetTotalSpending(id);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [totalSpendings, setTotalSpendings] = useState<number>();

  const webapp = useWebApp();

  useEffect(() => {
    webapp.ready();

    const backButton = webapp.BackButton;
    backButton.show();
    backButton.onClick(function () {
      backButton.hide();
    });

    const handleBack = () => {
      navigate(-1);
      backButton.hide();
    };

    webapp.onEvent('backButtonClicked', handleBack);
  }, [navigate, webapp]);

  useEffect(() => {
    if (totalSpendingsResponse) {
      setTotalSpendings(totalSpendingsResponse.data);
    }
  }, [totalSpendingsResponse]);

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
        <IconButton mr='3' onClick={() => navigate('/profile?tab=myprojects')}>
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
            {totalSpendingsLoading ? <Loading /> : <Heading>${totalSpendings}</Heading>}
          </Flex>
          <Button onClick={() => navigate('/profile?tab=transactions')}>
            <ChevronRightIcon /> Transactions
          </Button>
        </Flex>
      </Card>

      <Card mt='5'>
        <Flex align='center' justify='between'>
          <Button size='2' onClick={() => navigate(`/projects/${id}`)}>
            <MagnifyingGlassIcon />
            View Project Page
          </Button>
          <Button size='2' onClick={() => navigate(`/projects/${id}/edit`)}>
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
