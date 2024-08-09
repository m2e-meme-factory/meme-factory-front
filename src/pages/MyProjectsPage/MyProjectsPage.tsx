import React, { useEffect, useState } from 'react';
import { Button, Flex, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import MyProjectCard from './components/MyProjectCard/MyProjectCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import Loading from '../../shared/components/Loading';
import { useGetMyProjects } from '../../shared/utils/api/hooks/project/useGetMyProjects';
import { Project } from 'api';
import { useTelegram } from '../../shared/hooks/useTelegram';

const MyProjectsPage = () => {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const { data: projects, isLoading, error, refetch } = useGetMyProjects(currentUser?.id);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const { webApp } = useTelegram();

  useEffect(() => {
    if (projects) {
      setMyProjects(projects.data);
    }
  }, [projects]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex m='4' direction='column'>
      <Flex direction='column'>
        <Heading>My projects</Heading>
        <Link to='/create-project'>
          <Button style={{ width: '100%' }} size='3' mt='3'>
            Create project
          </Button>
        </Link>
      </Flex>
      <Flex mt='4' direction='column'>
        {myProjects.map((project, index) => (
          <MyProjectCard key={index}
            id={project.id}
            bannerUrl={project.bannerUrl}
            title={project.title}
            category={project.category}
            freelancersCount={0}
            status={project.status}
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default MyProjectsPage;
