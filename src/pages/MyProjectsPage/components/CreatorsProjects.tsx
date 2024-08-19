import React, { FC, useEffect, useState } from 'react';
import { Project, User } from 'api';
import { useGetUserProgresses } from '../../../shared/utils/api/hooks/project/useGetUserProgresses';
import makeAnimated from 'react-select/animated';
import { Flex, Heading, Text } from '@radix-ui/themes';
import MyProjectCard from './MyProjectCard/MyProjectCard';
import { CUSTOM_SELECT_STYLES_MULTI } from '../../../styles/customSelectStyles';
import Select, { MultiValue } from 'react-select';
import { PROJECT_STATUSES } from '../../../shared/consts/project-statuses';
import { Option } from '../../../@types/app';
import { APPLICATION_STATUSES } from '../../../shared/consts/application-statuses';

interface CreatorsProjectsProps {
  user: User;
}

const CreatorsProjects: FC<CreatorsProjectsProps> = ({ user }) => {
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [selectedProjectStatuses, setSelectedProjectStatuses] = useState<string[]>([]);
  const [selectedApplicationStatuses, setSelectedApplicationStatuses] = useState<string[]>([]);
  const animatedComponents = makeAnimated();

  const { data: response, isLoading } = useGetUserProgresses({
    userId: user?.id || '',
  });

  const handleProjectStatusChange = (selectedStatus: MultiValue<Option>) => {
    if (selectedStatus.length > 0) {
      setSelectedProjectStatuses(
        selectedStatus.map((status) => {
          return status.value;
        })
      );
    } else {
      setSelectedProjectStatuses([]);
    }
  };

  const handleApplicationStatusChange = (selectedStatus: MultiValue<Option>) => {
    if (selectedStatus.length > 0) {
      setSelectedApplicationStatuses(
        selectedStatus.map((status) => {
          return status.value;
        })
      );
    } else {
      setSelectedApplicationStatuses([]);
    }
  };

  useEffect(() => {
    if (response) {
      let projects = response.data
        .filter((progressWithProject) => {
          const isProjectStatusMatch =
            selectedProjectStatuses.length === 0 ||
            selectedProjectStatuses.includes(progressWithProject.project.status);
          const isApplicationStatusMatch =
            selectedApplicationStatuses.length === 0 ||
            selectedApplicationStatuses.includes(progressWithProject.progress.status);

          return isProjectStatusMatch && isApplicationStatusMatch;
        })
        .map((progress) => progress.project);

      setMyProjects(projects);
      console.log(projects);
    }
  }, [response, selectedProjectStatuses, selectedApplicationStatuses]);

  return (
    <>
      <Flex m='4' direction='column'>
        <Heading>My projects</Heading>
        <Flex mt='1' direction='column'>
          <Text mt='1' mb='1' weight='medium'>
            Project status:
          </Text>
          <Select
            onChange={handleProjectStatusChange}
            placeholder='Select project status'
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={PROJECT_STATUSES}
            styles={CUSTOM_SELECT_STYLES_MULTI}
            isMulti={true}
            isClearable={true}
          />

          <Text mt='3' mb='1' weight='medium'>
            Application status:
          </Text>
          <Select
            onChange={handleApplicationStatusChange}
            placeholder='Select application status'
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={APPLICATION_STATUSES}
            styles={CUSTOM_SELECT_STYLES_MULTI}
            isMulti={true}
            isClearable={true}
          />

          <Flex direction='column' mt='3'>
            {myProjects.map((project, index) => (
              <MyProjectCard
                key={index}
                id={project.id}
                bannerUrl={project.bannerUrl}
                title={project.title}
                category={project.category}
                freelancersCount={0}
                status={project.status}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default CreatorsProjects;
