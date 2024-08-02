import { Text, Flex, Heading } from '@radix-ui/themes';
import React, { useState } from 'react';
import TaskCard from './components/TaskCard/TaskCard';
import { CATEGORIES } from '../../shared/consts/categories';
import { TAGS } from '../../shared/consts/tags';
import { CUSTOM_SELECT_STYLES } from '../../styles/customSelectStyles';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const TasksPage = () => {
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState(null);
  const animatedComponents = makeAnimated();

  const handleTagsChange = (selectedTags: any) => {
    console.log('handleTagsChange:', selectedTags);
  };

  const handleCategoryChange = (selectedTags: any) => {
    console.log('handleTagsChange:', selectedTags);
  };

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
          <Select
            onChange={handleCategoryChange}
            placeholder='Select tags'
            closeMenuOnSelect={false}
            options={CATEGORIES}
            styles={CUSTOM_SELECT_STYLES}
          />
        </Flex>
        <Flex direction='column'>
          <Text mb='2' weight='medium'>
            Tags:
          </Text>
          <Select
            onChange={handleTagsChange}
            placeholder='Select tags'
            closeMenuOnSelect={false}
            components={animatedComponents}
            isMulti
            options={TAGS}
            styles={CUSTOM_SELECT_STYLES}
          />
        </Flex>
      </Flex>
      <Flex m='4' direction='column'>
        <TaskCard />
      </Flex>
    </>
  );
};

export default TasksPage;
