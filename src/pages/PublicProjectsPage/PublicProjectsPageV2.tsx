import React, { useEffect, useRef, useState } from 'react';
import { Flex, Button, Box, Tabs } from '@radix-ui/themes';
import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import Swiper from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import ProjectCard from './components/ProjectCard/ProjectCard';
import AutoTasksProjectCard from './components/AutoTasksProjectCard/AutoTasksProjectCard';
import CreatorsProjects from '../MyProjectsPage/components/CreatorsProjects';
import AdvertisersProjects from '../MyProjectsPage/components/AdvertisersProjects';
import Loading from '../../shared/components/Loading';

import { CATEGORIES } from '../../shared/consts/categories';
import { TAGS } from '../../shared/consts/tags';
import { Option } from '../../@types/app';
import { useGetPublicProjects } from '../../shared/utils/api/hooks/project/useGetPublicProjects';
import { RootState } from '../../shared/utils/redux/store';
import { Project } from 'api';
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';
import NothingFound from '../../shared/components/NothingFound';
import { SORTING_DIRECTIONS } from '../../shared/consts/sortingDirections';

const BlockObserver = styled.div`
  height: 40px;
  background-color: black;
`;

const SwiperContainer = styled.div`
  .swiper {
    width: 100%;
    height: 90vh;
    z-index: 0;
  }

  .swiper-slide {
    overflow-y: auto;
    z-index: 0;
  }
`;

enum TabsOption {
  MY = 'my',
  PUBLIC = 'public',
}

export default function PublicProjectsPage() {
  const loadedPages = useRef(new Set<number>());
  const user = useSelector((state: RootState) => state.user.user);

  const [tempTags, setTempTags] = useState<string[]>([]);
  const [tempCategory, setTempCategory] = useState<string | null>(null);
  const [tempSorting, setTempSorting] = useState<string | null>(null);

  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [sorting, setSorting] = useState<string | null>(null);

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const sortingRef = useRef<HTMLDivElement | null>(null);
  const [currentTab, setCurrentTab] = useState<TabsOption>(TabsOption.PUBLIC);
  const [showFindButton, setShowFindButton] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const swiperRef = useRef<Swiper | null>(null);
  const [[page, direction], setPage] = useState([0, 0]);

  const DISPLAY_LIMIT = 10;

  const previousTags = useRef<string[]>(tags);
  const previousCategory = useRef<string | null>(category);
  const previousSorting = useRef<string | null>(sorting);

  const animatedComponents = makeAnimated();

  const { data, isLoading } = useGetPublicProjects({
    tags: tags,
    category: category ? category : '',
    sorting: sorting ? sorting : '',
    page: currentPage,
    limit: DISPLAY_LIMIT,
  });

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleTabChange(TabsOption.MY),
    onSwipedRight: () => handleTabChange(TabsOption.PUBLIC),
    trackMouse: true,
  });

  useEffect(() => {
    swiperRef.current = new Swiper('.swiper', {
      direction: 'horizontal',
    });

    if (swiperRef.current) {
      swiperRef.current.on('slideChange', () => {
        setCurrentTab(swiperRef.current!.activeIndex === 0 ? TabsOption.PUBLIC : TabsOption.MY);
      });
    }

    return () => {
      if (swiperRef.current) {
        swiperRef.current.destroy(true, true);
      }
    };
  }, []);

  useEffect(() => {
    if (data && !loadedPages.current.has(currentPage)) {
      if (data.data.projects.length > 0) {
        if (
          JSON.stringify(previousTags.current) !== JSON.stringify(tags) ||
          previousCategory.current !== category ||
          previousSorting.current !== sorting
        ) {
          setProjects(data.data.projects);
        } else {
          setProjects((prevProjects) => [...prevProjects, ...data.data.projects]);
        }

        loadedPages.current.add(currentPage);
        previousTags.current = tags;
        previousCategory.current = category;
        previousSorting.current = sorting;
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

  const handleSortingChange = (selectedDirection: SingleValue<Option>) => {
    const sortingDirection = selectedDirection ? selectedDirection.value : null;
    setTempSorting(sortingDirection);
    setShowFindButton(true);
  };

  const handleFindButtonClick = () => {
    if (tempTags.length === 0 && tempCategory === null && tempSorting === null) {
      setTags([]);
      setCategory(null);
      setSorting(null);
    } else {
      setTags(tempTags);
      setCategory(tempCategory);
      setSorting(tempSorting);
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
    if (swiperRef.current) {
      swiperRef.current.slideTo(newTab === TabsOption.PUBLIC ? 0 : 1);
    }
  };

  return (
    <div {...swipeHandlers}>
      <Tabs.Root defaultValue='public' onValueChange={handleTabChange} value={currentTab}>
        <Tabs.List justify='center'>
          <Flex direction='row' justify='center' align='center' style={{ width: '100%' }}>
            <Flex direction='row'>
              <Tabs.Trigger value='public'>All</Tabs.Trigger>
              <Tabs.Trigger value='my'>
                {user?.role === 'creator' ? 'My Quests' : 'Created Quests'}
              </Tabs.Trigger>
            </Flex>
          </Flex>
        </Tabs.List>

        <Box pt='3'>
          <SwiperContainer>
            <div className='swiper'>
              <div className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <Flex direction='column'>
                    <Flex justify='between' p='4' pt='0' pb='0' direction='column'>
                      <Flex direction='column' gap='2' mb='1'>
                        <Flex
                          gap='2'
                          mb='1'
                          direction='row'
                          style={{
                            fontSize: 'var(--text-size-2)',
                          }}
                        >
                          <div
                            ref={categoryRef}
                            className='swiper-no-swiping'
                            style={{ width: '45%' }}
                          >
                            <Select
                              onChange={handleCategoryChange}
                              placeholder='Social'
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
                            ref={sortingRef}
                            className='swiper-no-swiping'
                            style={{ flexGrow: 1 }}
                          >
                            <Select
                              onChange={handleSortingChange}
                              placeholder='Sorting'
                              closeMenuOnSelect={true}
                              components={animatedComponents}
                              options={SORTING_DIRECTIONS}
                              styles={CUSTOM_SELECT_STYLES_SINGLE}
                              isSearchable={false}
                              isClearable={true}
                              isMulti={false}
                            />
                          </div>
                        </Flex>
                        <div ref={tagsRef} className='swiper-no-swiping'>
                          <Select
                            onChange={handleTagsChange}
                            placeholder='Tags'
                            closeMenuOnSelect={false}
                            components={animatedComponents}
                            isMulti
                            options={TAGS}
                            styles={CUSTOM_SELECT_STYLES_MULTI}
                            isSearchable={false}
                            isClearable={true}
                          />
                        </div>
                        {showFindButton && (
                          <Button variant='outline' onClick={handleFindButtonClick}>
                            Find
                          </Button>
                        )}
                      </Flex>
                    </Flex>
                    <Flex m='4' mb='8' gap='3' direction='column'>
                      <AutoTasksProjectCard />
                      {projects.map((project, index) => (
                        <ProjectCard key={index} project={project} />
                      ))}

                      {projects.length == 0 && !isLoading && <NothingFound />}
                    </Flex>
                    {isLoading && <Loading />}
                    {!isLoading && <BlockObserver ref={ref}></BlockObserver>}
                  </Flex>
                </div>
                <div className='swiper-slide'>
                  <Flex direction='column' justify='center'>
                    {user?.role === 'creator' && (
                      <Flex justify='center'>
                        <CreatorsProjects
                          user={user}
                          isOpened={isOpened}
                          setIsOpened={setIsOpened}
                        />
                      </Flex>
                    )}
                    {user?.role === 'advertiser' && <AdvertisersProjects user={user} />}
                  </Flex>
                </div>
              </div>
            </div>
          </SwiperContainer>
        </Box>
      </Tabs.Root>
    </div>
  );
}
