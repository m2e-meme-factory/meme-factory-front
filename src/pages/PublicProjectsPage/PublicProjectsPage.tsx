import React, { useEffect, useRef, useState } from 'react';
import { Text, Flex, Heading, Button, Box, Tabs, Callout } from '@radix-ui/themes';
import { motion, AnimatePresence } from 'framer-motion';
import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';

import ProjectCard from './components/ProjectCard/ProjectCard';
import AutoTasksProjectCard from './components/AutoTasksProjectCard/AutoTasksProjectCard';
import CreatorsProjects from '../MyProjectsPage/components/CreatorsProjects';
import AdvertisersProjects from '../MyProjectsPage/components/AdvertisersProjects';
import Loading from '../../shared/components/Loading';

import { CATEGORIES } from '../../shared/consts/categories';
import { TAGS } from '../../shared/consts/tags';
import { Option } from '../../@types/app';
import { useGetPublicProjects } from '../../shared/utils/api/hooks/project/useGetPublicProjects';
import { useGetRefData } from '../../shared/utils/api/hooks/user/useGetRefData';
import { RootState } from '../../shared/utils/redux/store';
import { Project } from 'api';
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';

const BlockObserver = styled.div`
  height: 40px;
  background-color: black;
`;

const TabContentWrapper = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

enum TabsOption {
  MY = 'my',
  PUBLIC = 'public',
}

const tabVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

const tabTransition = {
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
};

export default function Component() {
  const loadedPages = useRef(new Set<number>());
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
  const [isColumn, setIsColumn] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const [currentTab, setCurrentTab] = useState<TabsOption>(TabsOption.PUBLIC);
  const [showFindButton, setShowFindButton] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isCalloutVisible, setIsCalloutVisible] = useState(true);

  const [[page, direction], setPage] = useState([0, 0]);

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

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleTabChange(TabsOption.MY),
    onSwipedRight: () => handleTabChange(TabsOption.PUBLIC),
    trackMouse: true,
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
        if (currentPage === 1) {
          setProjects([]);
        }
        setIsEnd(true);
      }
    }
  }, [data, tags, category]);

  useEffect(() => {
    if (inView && !isEnd) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView]);

  useEffect(() => {
    if (categoryRef.current && tagsRef.current) {
      const categoryHeight = categoryRef.current.offsetHeight;
      const tagsHeight = tagsRef.current.offsetHeight;

      if (tagsHeight > categoryHeight) {
        setIsColumn(true);
      } else {
        setIsColumn(false);
      }
    }
  }, [tempCategory, tempTags]);

  const handleTagsChange = (selectedTags: MultiValue<Option>) => {
    const tags = selectedTags.map((tag) => tag.value);
    setTempTags(tags);
    setShowFindButton(true);
  };

  const handleCategoryChange = (selectedCategory: SingleValue<Option>) => {
    const category = selectedCategory ? selectedCategory.value : null;
    setTempCategory(category);
    setShowFindButton(true);
  };

  const handleFindButtonClick = () => {
    if (tempTags.length === 0 && tempCategory === null) {
      setTags([]);
      setCategory(null);
    } else {
      setTags(tempTags);
      setCategory(tempCategory);
    }

    setCurrentPage(1);
    loadedPages.current.clear();
    setIsOpened(false);
    setShowFindButton(false);
  };

  const handleTabChange = (value: string) => {
    const newTab = value as TabsOption;
    setPage([
      page + (newTab === TabsOption.PUBLIC ? -1 : 1),
      newTab === TabsOption.PUBLIC ? -1 : 1,
    ]);
    setCurrentTab(newTab);
    setIsOpened(false);
  };

  return (
    <div {...swipeHandlers}>
      <Flex m='4' direction='column'>
        <Flex justify='between' align='center'>
          <Box>
            <Heading>Projects</Heading>
            <Text color='gray'>Join project and earn profit!</Text>
          </Box>
        </Flex>
      </Flex>

      <Tabs.Root defaultValue='public' onValueChange={handleTabChange} value={currentTab}>
        <Tabs.List justify='start'>
          <Flex direction='row' justify='between' style={{ width: '100%' }} align='baseline'>
            <Flex direction='row'>
              <Tabs.Trigger value='public'>All Projects</Tabs.Trigger>
              <Tabs.Trigger value='my'>
                {user?.role === 'creator' ? 'Joined' : 'My projects'}
              </Tabs.Trigger>
            </Flex>
            {!(user?.role === 'advertiser' && currentTab === 'my') && (
              <Button
                size='1'
                mr='3'
                style={{ borderRadius: '15px' }}
                onClick={() => setIsOpened(!isOpened)}
              >
                Filters
              </Button>
            )}
          </Flex>
        </Tabs.List>

        <Box pt='3' style={{ position: 'relative', minHeight: '600px' }}>
          <AnimatePresence initial={false} custom={direction}>
            <TabContentWrapper
              key={currentTab}
              custom={direction}
              variants={tabVariants}
              initial='enter'
              animate='center'
              exit='exit'
              transition={tabTransition}
            >
              {currentTab === TabsOption.PUBLIC && (
                <>
                  <Box style={{ display: isOpened ? 'block' : 'none' }}>
                    <Flex justify='between' p='4' pt='0' pb='0' direction='column'>
                      <Flex direction='column' gap='2' mb='1'>
                        <Flex direction={isColumn ? 'column' : 'row'} gap='2' mb='1' wrap='wrap'>
                          <div
                            style={{
                              flexGrow: 1,
                              width: isColumn ? '100%' : 'auto',
                            }}
                            ref={categoryRef}
                          >
                            <Select
                              onChange={handleCategoryChange}
                              placeholder='Select category'
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              options={CATEGORIES}
                              styles={CUSTOM_SELECT_STYLES_SINGLE}
                              isMulti={false}
                              isSearchable={false}
                              isClearable={true}
                            />
                          </div>
                          <div
                            style={{
                              flexGrow: 1,
                              width: isColumn ? '100%' : 'auto',
                            }}
                            ref={tagsRef}
                          >
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
                          </div>
                        </Flex>
                        {showFindButton && <Button onClick={handleFindButtonClick}>Find</Button>}
                      </Flex>
                    </Flex>
                  </Box>
                  {isCalloutVisible && (
                    <Flex m='4'>
                      <Callout.Root
                        color='yellow'
                        style={{ position: 'relative', padding: '1rem' }}
                      >
                        <Callout.Icon style={{ marginTop: '0.4rem' }}>
                          <InfoCircledIcon />
                        </Callout.Icon>
                        <Callout.Text style={{ marginTop: '0.4rem', marginRight: '0.2rem' }}>
                          Discover a range of available projects on this page, where you can join
                          and tackle tasks to earn m2e rewards.
                        </Callout.Text>
                        <button
                          onClick={() => {
                            setIsCalloutVisible(false);
                          }}
                          style={{
                            position: 'absolute',
                            top: '0.5rem',
                            right: '0.5rem',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                          }}
                        >
                          <Cross2Icon />
                        </button>
                      </Callout.Root>
                    </Flex>
                  )}
                  <Flex m='4' mb='8' direction='column'>
                    <AutoTasksProjectCard />
                    {projects.map((project, index) => (
                      <ProjectCard key={index} project={project} />
                    ))}
                  </Flex>
                  {isLoading && <Loading />}
                  {!isLoading && <BlockObserver ref={ref}></BlockObserver>}
                </>
              )}
              {currentTab === TabsOption.MY && (
                <>
                  {user?.role === 'creator' && (
                    <Flex justify='center'>
                      <CreatorsProjects user={user} isOpened={isOpened} setIsOpened={setIsOpened} />
                    </Flex>
                  )}
                  {user?.role === 'advertiser' && <AdvertisersProjects user={user} />}
                </>
              )}
            </TabContentWrapper>
          </AnimatePresence>
        </Box>
      </Tabs.Root>
    </div>
  );
}
