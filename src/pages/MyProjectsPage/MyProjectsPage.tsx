import React, { useEffect, useState } from 'react';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import MyProjectCard from './components/MyProjectCard/MyProjectCard';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';
import Loading from '../../shared/components/Loading';
import { useGetMyProjects } from '../../shared/utils/api/hooks/project/useGetMyProjects';
import { Project } from 'api';
import { useTelegram } from '../../shared/hooks/useTelegram';
import Select, { SingleValue } from 'react-select';
import { CATEGORIES } from '../../shared/consts/categories';
import {
  CUSTOM_SELECT_STYLES_MULTI,
  CUSTOM_SELECT_STYLES_SINGLE,
} from '../../styles/customSelectStyles';
import { TAGS } from '../../shared/consts/tags';
import { Option } from '../../@types/app';
import { Role } from '../../shared/consts/userRoles';
import makeAnimated from 'react-select/animated';
import { ROLES_OPTIONS } from '../../shared/consts/rolesOptions';

const MyProjectsPage = () => {
  const currentUser = useSelector((state: RootState) => state.user.user);
  const { data: projects, isLoading } = useGetMyProjects(currentUser?.id);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [userRole, setUserRole] = useState<Role | null>(Role.CREATOR);

  const animatedComponents = makeAnimated();

  const handleRoleChange = (selectedRole: SingleValue<Option>) => {
    const role = selectedRole ? selectedRole.value : null;

    if (role && Object.values(Role).includes(role as Role)) {
      setUserRole(role as Role);
    } else {
      setUserRole(null);
    }
  };

  const handleFindButtonClick = () => {
    //todo
  };

  useEffect(() => {
    if (projects) {
      setMyProjects(projects.data);
    }
  }, [projects]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <Heading mr='3'>My projects</Heading>
        <Link to='/create-project'>
          <Button style={{ width: '100%' }} size='3'>
            Create project
          </Button>
        </Link>
      </Flex>
      <Flex justify='between' direction='column'>
        <Flex direction='column' mb='3'>
          <Text mb='2' weight='medium'>
            Filter by role:
          </Text>
          <Select
            onChange={handleRoleChange}
            placeholder='Select role'
            closeMenuOnSelect={false}
            components={animatedComponents}
            options={ROLES_OPTIONS}
            styles={CUSTOM_SELECT_STYLES_SINGLE}
            isMulti={false}
            isClearable={true}
          />
        </Flex>
        <Button onClick={handleFindButtonClick}>Find</Button>
      </Flex>
      <Flex mt='4' direction='column'>
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
  );
};

export default MyProjectsPage;
