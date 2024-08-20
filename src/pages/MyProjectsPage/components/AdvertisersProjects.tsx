import React, { FC, useEffect, useRef, useState } from 'react';
import { Project, User } from 'api';
import { useGetMyProjects } from '../../../shared/utils/api/hooks/project/useGetMyProjects';
import makeAnimated from 'react-select/animated';
import { useInView } from 'react-intersection-observer';
import { Button, Flex, Heading } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import MyProjectCard from './MyProjectCard/MyProjectCard';
import Loading from '../../../shared/components/Loading';
import styled from 'styled-components';

const BlockObserver = styled.div`
  height: 40px;
  background-color: black;
`;

interface AdvertisersProjectsProps {
  user: User;
}

const AdvertisersProjects: FC<AdvertisersProjectsProps> = ({ user }) => {
  const loadedPages = useRef(new Set<number>());

  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);

  const DISPLAY_LIMIT = 10;
  const { data: projectsResponse, isLoading } = useGetMyProjects({
    userId: user?.id || '',
    page: currentPage,
    limit: DISPLAY_LIMIT,
  });

  const animatedComponents = makeAnimated();

  const { ref, inView } = useInView({
    threshold: 1.0,
  });

  useEffect(() => {
    if (projectsResponse && !loadedPages.current.has(currentPage)) {
      if (projectsResponse.data.projects.length > 0) {
        setMyProjects((prevProjects) => [...prevProjects, ...projectsResponse.data.projects]);
        setIsEnd(false);
        loadedPages.current.add(currentPage);
      } else {
        setIsEnd(true);
      }
    }
  }, [projectsResponse]);

  useEffect(() => {
    if (inView && !isEnd) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [inView]);

  return (
    <>
      <Flex m='4' direction='column'>
        <Flex align='center'>
          <Heading mr='3'>My projects</Heading>
          <Link to='/create-project'>
            <Button style={{ width: '100%' }} size='3'>
              Create project
            </Button>
          </Link>
        </Flex>
        <Flex mt='4' direction='column'>
          {myProjects.map((project, index) => (
            <MyProjectCard
              key={index}
              id={project.id}
              bannerUrl={project.bannerUrl}
              title={project.title}
              category={project.category}
              status={project.status}
            />
          ))}
        </Flex>
      </Flex>
      {isLoading && <Loading />}
      {!isLoading && <BlockObserver ref={ref}></BlockObserver>}
    </>
  );
};

export default AdvertisersProjects;
