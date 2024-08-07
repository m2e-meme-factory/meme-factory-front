import React, { useEffect, useState } from 'react';
import { Button, Flex, Heading, IconButton } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import MyProjectCard from './components/MyProjectCard/MyProjectCard';
import { useGetPublicProjects } from '../../shared/utils/api/hooks/project/useGetPublicProjects';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { Project } from '../../@types/api';
import Loading from '../../shared/components/Loading';

const MyProjectsPage = () => {
  const {data, isLoading} = useGetPublicProjects();
  const user = useSelector((state: RootState) => state.user.user);
  const [myProjects, setMyProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (data) {
      setMyProjects(data.data.filter((project) => project.authorId === user?.id));
    }
  }, [data]);

  if (isLoading) {
    return (
      <Loading/>
    )
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
          <MyProjectCard
            bannerUrl={project.bannerUrl}
            title={project.title}
            category={project.category}
            freelancersCount={0}
            status='published'
          />
        ))}
      </Flex>
    </Flex>
  );
};

export default MyProjectsPage;
