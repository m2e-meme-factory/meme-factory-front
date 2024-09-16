import { Text, Flex, Heading, Button, Dialog, Box, IconButton } from '@radix-ui/themes';
import React, { useEffect, useRef, useState } from 'react';
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
import { Project, ProjectProgress, User } from 'api';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import SubtaskCard from '../ProjectPage/components/SubtaskCard/SubtaskCard';
import { UserRoleInProject } from '../ProjectPage/ProjectPage';
import AutotaskCard from '../AutotasksProject/components/Autotask/Autotask';
import AutoTasksProjectCard from './components/AutoTasksProjectCard/AutoTasksProjectCard';
import { FilterOutlined } from '@ant-design/icons';
import { MixerHorizontalIcon } from '@radix-ui/react-icons';
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogOverlay,
//   DialogPortal,
//   DialogTitle,
//   DialogTrigger,
// } from '@radix-ui/react-dialog';
// import { Cross2Icon } from '@radix-ui/react-icons';

const BlockObserver = styled.div`
  height: 40px;
  background-color: black;
`;

// add props is opened
const FiltersContent = styled(Box)`
  overflow: hidden;
  transition: 0.6s ease all;
`;

const PublicProjectsPage = () => {
  const loadedPages = useRef(new Set<number>());
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tempCategory, setTempCategory] = useState<string | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const [refsCount, setRefsCount] = useState<number>(0);
  const [autoTaskDone, setAutoTaskDone] = useState<boolean>(false);

  const DISPLAY_LIMIT = 10;

  const previousTags = useRef<string[]>(tags);
  const previousCategory = useRef<string | null>(category);

  const animatedComponents = makeAnimated();

  const { data, isLoading } = useGetPublicProjects({
    tags: tags,
    category: category ? category : '',
    page: currentPage,
    limit: DISPLAY_LIMIT,
  });

  const { data: refResponse, isLoading: refLoading } = useGetRefData(user?.telegramId);

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  useEffect(() => {
    if (user && refResponse) {
      setRefsCount(refResponse.data.count);
    }
  }, [refResponse]);

  useEffect(() => {
    if (data && !loadedPages.current.has(currentPage)) {
      if (data.data.projects.length > 0) {
        if (
          JSON.stringify(previousTags.current) !== JSON.stringify(tags) ||
          previousCategory.current !== category
        ) {
          setProjects(data.data.projects);
        } else {
          setProjects((prevProjects) => [...prevProjects, ...data.data.projects]);
        }

        loadedPages.current.add(currentPage);
        previousTags.current = tags;
        previousCategory.current = category;
        setIsEnd(false);
      } else {
        setIsEnd(true);
      }
    }
  }, [data, tags, category]);

  useEffect(() => {
    if (inView && !isEnd) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView]);

  const handleTagsChange = (selectedTags: MultiValue<Option>) => {
    const tags = selectedTags.map((tag) => tag.value);
    setTempTags(tags);
  };

  const handleCategoryChange = (selectedCategory: SingleValue<Option>) => {
    const category = selectedCategory ? selectedCategory.value : null;
    setTempCategory(category);
  };

  const handleFindButtonClick = () => {
    setTags(tempTags);
    setCategory(tempCategory);
    setCurrentPage(1);
    loadedPages.current.clear();
  };

  const [isOpened, setIsOpened] = useState(false);

  return (
    <>
      <Flex m='4' direction='column'>
        <Flex justify='between' align='center'>
          <Box>
            <Heading>Projects</Heading>
            <Text color='gray'>Earn M2E by completing them</Text>2
          </Box>

          <IconButton size='3' onClick={() => setIsOpened(!isOpened)}>
            <MixerHorizontalIcon />
          </IconButton>
        </Flex>
      </Flex>
      {/* <Flex justify='between' p='4' direction='column'>
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
            isSearchable={false}
            isClearable={true}
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
            isSearchable={false}
            isClearable={true}
          />
        </Flex>
        <Button mt='3' onClick={handleFindButtonClick}>
          Find
        </Button>
      </Flex> */}

      <FiltersContent style={{ height: isOpened ? 'auto' : '0' }}>
        <Flex justify='between' p='4' pt='0' direction='column'>
          <Flex direction='column' gap='4' mb='2'>
            <Flex direction='column'>
              <Text weight='medium'>Category:</Text>
              <Select
                onChange={handleCategoryChange}
                placeholder='Select category'
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={CATEGORIES}
                styles={CUSTOM_SELECT_STYLES_SINGLE}
                isMulti={false}
                isSearchable={false}
                isClearable={true}
              />
            </Flex>
            <Flex direction='column'>
              <Text weight='medium'>Tags:</Text>
              <Select
                onChange={handleTagsChange}
                placeholder='Select tags'
                closeMenuOnSelect={false}
                components={animatedComponents}
                isMulti
                options={TAGS}
                styles={CUSTOM_SELECT_STYLES_MULTI}
                isSearchable={false}
                isClearable={true}
              />
            </Flex>
            <Button onClick={handleFindButtonClick}>Find</Button>
          </Flex>
        </Flex>
      </FiltersContent>

      <Flex m='4' direction='column'>
        <AutoTasksProjectCard />
        {projects.map((project, index) => (
          <ProjectCard key={index} project={project} />
        ))}
      </Flex>
      {isLoading && <Loading />}
      {!isLoading && <BlockObserver ref={ref}></BlockObserver>}
    </>
  );
};

export default PublicProjectsPage;
