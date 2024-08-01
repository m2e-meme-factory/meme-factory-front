import TaskCard from '../TasksPage/components/TaskCard/TaskCard';
import React from 'react';
import { Button, Flex, Heading, IconButton } from '@radix-ui/themes';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const MyProjectsPage = () => {
  const navigate = useNavigate();

  return (
    <Flex m='4' direction="column">
      <Flex align='center' justify='between'>
        <Flex align='center'>
          <IconButton size='1' onClick={() => navigate(-1)} mr='3'><ArrowLeftIcon/></IconButton>
          <Heading>My projects</Heading>
        </Flex>
        <Link to='/projects/create'>
          <Button>Create new</Button>
        </Link>
      </Flex>
      <Flex mt='4' direction='column'>
        <TaskCard />
        <TaskCard />
        <TaskCard />
      </Flex>
    </Flex>
  )
}

export default MyProjectsPage;