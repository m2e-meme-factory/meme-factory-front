import { Text, Flex, Heading, Button } from '@radix-ui/themes';
import React, { useState } from 'react';
import ProjectCard from './components/ProjectCard/ProjectCard';
import { CATEGORIES } from '../../shared/consts/categories';
import { TAGS } from '../../shared/consts/tags';
import { CUSTOM_SELECT_STYLES } from '../../styles/customSelectStyles';
import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { Option } from '../../@types/app';

const TasksPage = () => {
  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const animatedComponents = makeAnimated();

  const handleTagsChange = (selectedTags: MultiValue<Option>) => {
    const tags = selectedTags.map((tag) => tag.value);
    console.log('handleTagsChange:', tags);
    setTags(tags);
  };

  const handleCategoryChange = (selectedCategory: SingleValue<Option>) => {
    const category = selectedCategory ? selectedCategory.value : null;
    console.log('handleTagsChange:', category);
    setCategory(category);
  };

  const handleFindButtonClick = () => {
    console.log('handleFindButtonClick', tags, category);
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
            placeholder='Select category'
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={CATEGORIES}
            styles={CUSTOM_SELECT_STYLES}
            isMulti={false}
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
        <Button mt='3' onClick={handleFindButtonClick}>
          Find
        </Button>
      </Flex>
      <Flex m='4' direction='column'>
        <ProjectCard />
      </Flex>
    </>
  );
};

export default TasksPage;
