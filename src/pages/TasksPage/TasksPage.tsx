import { Text, Flex, Heading } from '@radix-ui/themes';
import React from 'react';
import TaskCard from './components/TaskCard/TaskCard';
import Select from '../../shared/components/Select/Select';

const TasksPage = () => {
  const options = ['opt1', 'opt2', 'opt3'];

  return (
    <>
      <Flex m='4' direction='column'>
        <Heading>Recent Tasks</Heading>
        <Text color='gray'>Earn M2E by completing them</Text>
      </Flex>
      <Flex justify='between' p='4'>
        <Flex direction='column'>
          <Text mb='2' weight='medium'>
            Category:
          </Text>
          <Select options={options}></Select>
        </Flex>
        <Flex direction='column'>
          <Text mb='2' weight='medium'>
            Tags:
          </Text>
          <Select options={options}></Select>
        </Flex>
      </Flex>
      <Flex m='4' direction='column'>
        <TaskCard />
      </Flex>
    </>
  );
};

export default TasksPage;
