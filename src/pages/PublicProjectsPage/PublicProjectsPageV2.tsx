import React, { useEffect, useRef, useState } from 'react';
import { Text, Flex, Heading, Button, Box, Tabs, Callout, ScrollArea } from '@radix-ui/themes';
import Select, { MultiValue, SingleValue } from 'react-select';
import makeAnimated from 'react-select/animated';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { useSwipeable } from 'react-swipeable';
import { Cross2Icon, InfoCircledIcon } from '@radix-ui/react-icons';
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

const BlockObserver = styled.div`
  height: 40px;
  background-color: black;
`;

const SwiperContainer = styled.div`
  .swiper {
    width: 100%;
    height: calc(100vh - 150px);
    z-index: 0;
  }

  .swiper-slide {
    overflow-y: auto;
    padding-bottom: 60px;
    z-index: 0;
  }

  .swiper-pagination {
    bottom: 10px !important;
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

  const [tags, setTags] = useState<string[]>([]);
  const [category, setCategory] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);
  const [isColumn, setIsColumn] = useState(false);
  const categoryRef = useRef<HTMLDivElement | null>(null);
  const tagsRef = useRef<HTMLDivElement | null>(null);
  const [currentTab, setCurrentTab] = useState<TabsOption>(TabsOption.PUBLIC);
  const [showFindButton, setShowFindButton] = useState(false);
  const [isOpened, setIsOpened] = useState(false);
  const [isCalloutVisible, setIsCalloutVisible] = useState(true);
  const swiperRef = useRef<Swiper | null>(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
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
        setCurrentSlideIndex(swiperRef.current!.activeIndex);
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
    if (swiperRef.current) {
      swiperRef.current.slideTo(newTab === TabsOption.PUBLIC ? 0 : 1);
    }
  };

  return (
    <div {...swipeHandlers}>
      <Tabs.Root defaultValue='public' onValueChange={handleTabChange} value={currentTab}>
        <Tabs.List justify='start'>
          <Flex direction='row' justify='between' align='center' style={{ width: '100%' }} >
            <Flex direction='row'>
              <Tabs.Trigger value='public'>All</Tabs.Trigger>
              <Tabs.Trigger value='my'>
                {user?.role === 'creator' ? 'Joined' : 'My Tasks'}
              </Tabs.Trigger>
            </Flex>
            {!(user?.role === 'advertiser' && currentTab === 'my') && (
              <Button
                variant='outline'
                size='1'
                mr='3'
                // style={{ borderRadius: '15px' }}
                onClick={() => setIsOpened(!isOpened)}
              >
                <svg height="var(--text-size-2)" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M6 12h12M4 8h16M8 16h8" stroke="currentColor" stroke-width="1.5" stroke-miterlimit="10" stroke-linecap="round"></path></g></svg>
                Filters
              </Button>
            )}
          </Flex>
        </Tabs.List>

        <Box pt='3'>
          
        {isCalloutVisible && (
                        <Flex ml="4" mr="4" mb={isOpened ? '4' : '0'}>
                          <Callout.Root
                            color='yellow'
                            style={{ position: 'relative', padding: '1rem' }}
                          >
                            <Callout.Icon style={{ marginTop: '0.4rem' }}>
                              <InfoCircledIcon />
                            </Callout.Icon>
                            <Callout.Text style={{ marginTop: '0.4rem', marginRight: '0.2rem' }}>
                            Complete Tasks & Quests to increase Airdrop chance
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

          <SwiperContainer>
            <div className='swiper'>
              <div className='swiper-wrapper'>
                <div className='swiper-slide'>
                  <ScrollArea>
                    <Flex direction='column'>
                      <Box style={{ display: isOpened ? 'block' : 'none' }}>
                        <Flex justify='between' p='4' pt='0' pb='0' direction='column'>
                          <Flex direction='column' gap='2' mb='1'>
                            <Flex direction={isColumn ? 'column' : 'row'} gap='2' mb='1' wrap='wrap' style={{
                              fontSize: "var(--text-size-2)"
                            }}>
                              <div
                                style={{
                                  flexGrow: 1,
                                  width: isColumn ? '100%' : 'auto',
                                }}
                                ref={categoryRef}
                                className='swiper-no-swiping'
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
                                className='swiper-no-swiping'
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
                            {showFindButton && <Button variant='outline' onClick={handleFindButtonClick}>Find</Button>}
                          </Flex>
                        </Flex>
                      </Box>
                      <Flex m='4' mb='8' direction='column'>
                        <AutoTasksProjectCard />
                        {projects.map((project, index) => (
                          <ProjectCard key={index} project={project} />
                        ))}

                        {(projects.length == 0 && !isLoading) && (
                            <NothingFound />
                        )}
                      </Flex>
                      {isLoading && <Loading />}
                      {!isLoading && <BlockObserver ref={ref}></BlockObserver>}
                    </Flex>
                  </ScrollArea>
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
