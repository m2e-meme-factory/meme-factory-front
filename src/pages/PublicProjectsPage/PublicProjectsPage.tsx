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
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';
import { Project } from 'api';
import { useTelegram } from '../../shared/hooks/useTelegram';
import { login, LoginConfig } from '../../shared/utils/api/requests/auth/login';

const PublicProjectsPage = () => {
  const { data, isLoading, error, refetch } = useGetPublicProjects();
  const {webApp} = useTelegram();

  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const animatedComponents = makeAnimated();

  useEffect(() => {
    if (data) {
      setProjects(data.data);
    }
  }, [data]);

  useEffect(() => {
    const handleErrors = async () => {
      if (error) {
        if (webApp) {
          const loginConfig: LoginConfig = {
            params: { initData: { initData: webApp.initData } },
          };
          try {
            const response = await login(loginConfig);
            const newToken = response.data.token;
            localStorage.setItem('token', newToken);

            const {data: refetchedProjects} = await refetch();
            setProjects(refetchedProjects?.data || []);
          } catch (loginError) {
            console.error('Login failed:', loginError);
          }
        }
      }
    }

    handleErrors();
  }, [error, webApp, refetch]);

  if (isLoading) {
    return <Loading />;
  }

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
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </Flex>
    </>
  );
};

export default PublicProjectsPage;
