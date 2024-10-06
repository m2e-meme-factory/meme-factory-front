import React, { FC, useEffect, useState } from 'react';
import { ProjectData, User } from 'api';
import { useGetUserProgresses } from '../../../shared/utils/api/hooks/project/useGetUserProgresses';
import makeAnimated from 'react-select/animated';
import { Button, Flex, Heading, Spinner, Text } from '@radix-ui/themes';
import { CUSTOM_SELECT_STYLES_MULTI } from '../../../styles/customSelectStyles';
import Select, { MultiValue } from 'react-select';
import { PROJECT_STATUSES } from '../../../shared/consts/project-statuses';
import { Option } from '../../../@types/app';
import { APPLICATION_STATUSES } from '../../../shared/consts/application-statuses';
import MyProjectCardForCreator from './MyProjectCard/MyProjectCardForCreator';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import { setProject } from '../../../shared/utils/redux/project/projectSlice';

interface CreatorsProjectsProps {
  user: User;
  isOpened: boolean;
  setIsOpened: (opened: boolean) => void;
}

const CreatorsProjects: FC<CreatorsProjectsProps> = ({ user, isOpened, setIsOpened }) => {
  const [myProjects, setMyProjects] = useState<ProjectData[]>([]);
  const [selectedProjectStatuses, setSelectedProjectStatuses] = useState<string[]>([]);
  const [selectedApplicationStatuses, setSelectedApplicationStatuses] = useState<string[]>([]);
  const [showFindButton, setShowFindButton] = useState(false);
  const animatedComponents = makeAnimated();

  const { data: response } = useGetUserProgresses({
    userId: user?.id || '',
  });

  useEffect(() => {
    if (response) {
      let projects = response.data.map((progress) => progress.project);
      setMyProjects(projects);
    }
  }, [response]);

  const handleProjectStatusChange = (selectedStatus: MultiValue<Option>) => {
    setSelectedProjectStatuses(selectedStatus.map((status) => status.value));
    setShowFindButton(true);
  };

  const handleApplicationStatusChange = (selectedStatus: MultiValue<Option>) => {
    setSelectedApplicationStatuses(selectedStatus.map((status) => status.value));
    setShowFindButton(true);
  };

  const handleFindButtonClick = () => {
    if (response) {
      let projects = response.data
        .filter((progressWithProject) => {
          const isProjectStatusMatch =
            selectedProjectStatuses.length === 0 ||
            selectedProjectStatuses.includes(progressWithProject.project.status);
          const isApplicationStatusMatch =
            selectedApplicationStatuses.length === 0 ||
            selectedApplicationStatuses.includes(progressWithProject.progress.status);
          console.log(isProjectStatusMatch, isApplicationStatusMatch);
          return isProjectStatusMatch && isApplicationStatusMatch;
        })
        .map((progress) => progress.project);

      setMyProjects(projects);
      setIsOpened(false);
      setShowFindButton(false);
    }
  };

  console.log(myProjects);

  return (
    <>
      <Flex justify='center' p='1' pt='0' pb='0' direction='column'>
        <div style={{ display: isOpened ? 'block' : 'none' }}>
          <Flex direction='column' gap='2'>
            <Flex direction='row' justify='between' gap='2'>
              <div style={{ flexGrow: '1' }}>
                <Select
                  isSearchable={false}
                  onChange={handleProjectStatusChange}
                  placeholder='Project status'
                  closeMenuOnSelect={false}
                  components={animatedComponents}
                  options={PROJECT_STATUSES}
                  styles={CUSTOM_SELECT_STYLES_MULTI}
                  isMulti={true}
                  isClearable={true}
                />
              </div>

              <Select
                isSearchable={false}
                onChange={handleApplicationStatusChange}
                placeholder='Application status'
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={APPLICATION_STATUSES}
                styles={CUSTOM_SELECT_STYLES_MULTI}
                isMulti={true}
                isClearable={true}
              />
            </Flex>
            {showFindButton && <Button onClick={handleFindButtonClick}>Find</Button>}
          </Flex>
        </div>
      </Flex>
      <Flex direction='column' mt='3'>
        {myProjects.length === 0 ? (
          <Flex direction='column' style={{ height: '50vh' }} align='center' justify='center'>
            <MagnifyingGlassIcon style={{ width: '30px', height: '30px', color: 'gray' }} />
            <Text color='gray'>You haven't joined any project yet</Text>
          </Flex>
        ) : (
          myProjects.map((project, index) => (
            <MyProjectCardForCreator
              key={index}
              id={project.id}
              bannerUrl={project.bannerUrl}
              title={project.title}
              category={project.category}
            />
          ))
        )}
      </Flex>
    </>
  );
};

export default CreatorsProjects;
