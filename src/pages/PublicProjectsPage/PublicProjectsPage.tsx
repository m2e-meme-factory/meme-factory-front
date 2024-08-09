import { Text, Flex, Heading, Button } from '@radix-ui/themes';
import React, { useEffect, useState } from 'react';
import ProjectCard from './components/ProjectCard/ProjectCard';
import { CATEGORIES } from '../../shared/consts/categories';
import { TAGS } from '../../shared/consts/tags';
import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { Option } from '../../@types/app';
import { useGetPublicProjects } from '../../shared/utils/api/hooks/project/useGetPublicProjects';
import Loading from '../../shared/components/Loading';
import { CUSTOM_SELECT_STYLES_MULTI, CUSTOM_SELECT_STYLES_SINGLE } from '../../styles/customSelectStyles';
import { Project } from 'api';

const PublicProjectsPage = () => {
  const { data, isLoading } = useGetPublicProjects();

  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);

  const animatedComponents = makeAnimated();

  useEffect(() => {
    if (data) {
      setProjects(data.data);
      setFilteredProjects(data.data);
    }
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  const handleTagsChange = (selectedTags: MultiValue<Option>) => {
    const tags = selectedTags.map((tag) => tag.value);
    setTags(tags);
  };

  const handleCategoryChange = (selectedCategory: SingleValue<Option>) => {
    const category = selectedCategory ? selectedCategory.value : null;
    setCategory(category);
  };

  const handleFindButtonClick = () => {
    setFilteredProjects(projects.filter((project) =>  project.tags.filter((t) => tags.includes(t)).length >= 0 && (category ? category == project.category : true)));
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
            styles={CUSTOM_SELECT_STYLES_SINGLE}
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
            styles={CUSTOM_SELECT_STYLES_MULTI}
          />
        </Flex>
        <Button mt='3' onClick={handleFindButtonClick}>
          Find
        </Button>
      </Flex>
      <Flex m='4' direction='column'>
        {filteredProjects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </Flex>
    </>
  );
};

export default PublicProjectsPage;
