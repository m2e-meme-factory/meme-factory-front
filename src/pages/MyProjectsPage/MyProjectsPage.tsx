import ProjectCard from '../PublicProjectsPage/components/ProjectCard/ProjectCard';
import React from 'react';
import { Button, Flex, Heading, IconButton } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import MyProjectCard from './components/MyProjectCard/MyProjectCard';

const MyProjectsPage = () => {
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
        <MyProjectCard
          title='Sample project'
          category='Design'
          freelancersCount={999}
          status='published'
        ></MyProjectCard>
      </Flex>
    </Flex>
  );
};

export default MyProjectsPage;
