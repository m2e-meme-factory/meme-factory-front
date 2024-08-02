import { Text, Flex, Heading, Select } from '@radix-ui/themes';
import React from 'react';
import TaskCard from './components/TaskCard/TaskCard';
import { CATEGORIES } from '../../shared/consts/categories';
import { TAGS } from '../../shared/consts/tags';

const TasksPage = () => {
  const options = ['opt1', 'opt2', 'opt3'];

  return (
    <>
      <Flex m='4' direction='column'>
        <Heading>Public projects</Heading>
        <Text color='gray'>Earn M2E by completing them</Text>
      </Flex>
      <Flex justify='between' p='4' direction='column'>
        <Flex direction='column' mb='5'>
          <Text mb='2' weight='medium'>
            Category:
          </Text>
          <Select.Root>
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                {CATEGORIES.map((category, index) => (
                  <Select.Item value={category.value}>{category.label}</Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
        <Flex direction='column'>
          <Text mb='2' weight='medium'>
            Tags:
          </Text>
          <Select.Root>
            <Select.Trigger />
            <Select.Content>
              <Select.Group>
                {TAGS.map((tag, index) => (
                  <Select.Item value={tag.value}>{tag.label}</Select.Item>
                ))}
              </Select.Group>
            </Select.Content>
          </Select.Root>
        </Flex>
      </Flex>
      <Flex m='4' direction='column'>
        <TaskCard />
      </Flex>
    </>
  );
};

export default TasksPage;
