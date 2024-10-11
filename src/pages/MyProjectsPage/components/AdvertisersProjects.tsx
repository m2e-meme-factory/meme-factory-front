import React, { FC, useEffect, useRef, useState } from 'react';
import { Project, User } from 'api';
import { useGetMyProjects } from '../../../shared/utils/api/hooks/project/useGetMyProjects';
import { useInView } from 'react-intersection-observer';
import { Button, Flex, Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import MyProjectCard from './MyProjectCard/MyProjectCard';
import Loading from '../../../shared/components/Loading';
import styled from 'styled-components';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';

const BlockObserver = styled.div`
  height: 40px;
  background-color: black;
`;

interface AdvertisersProjectsProps {
  user: User;
}

const AdvertisersProjects: FC<AdvertisersProjectsProps> = ({ user }) => {
  const loadedPages = useRef(new Set<number>());
  const navigate = useNavigate();

  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);

  const DISPLAY_LIMIT = 10;
  const { data: projectsResponse, isLoading } = useGetMyProjects({
    userId: user?.id || '',
    page: currentPage,
    limit: DISPLAY_LIMIT,
  });

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
          <Button
            onClick={() => {
              navigate('/create-project');
            }}
            style={{ width: '100%' }}
            size='3'
          >
            Create project
          </Button>
        </Flex>
        <Flex mt='4' direction='column'>
          {myProjects.length === 0 ? (
            <Flex direction='column' style={{ height: '50vh' }} align='center' justify='center'>
              <MagnifyingGlassIcon style={{ width: '30px', height: '30px', color: 'gray' }} />
              <Text color='gray'>No Projects Found</Text>
            </Flex>
          ) : (
            myProjects.map((project, index) => (
              <MyProjectCard
                key={index}
                id={project.project.id}
                bannerUrl={project.project.bannerUrl}
                title={project.project.title}
                category={project.project.category}
                status={project.project.status}
              />
            ))
          )}
        </Flex>
      </Flex>
      {isLoading && <Loading />}
      {!isLoading && <BlockObserver ref={ref}></BlockObserver>}
    </>
  );
};

export default AdvertisersProjects;
