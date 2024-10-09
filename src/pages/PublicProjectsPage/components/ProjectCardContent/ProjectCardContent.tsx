import { Flex, Heading, Text } from '@radix-ui/themes';
import { TagsOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { ProjectData } from 'api';
import styled from 'styled-components';

interface ProjectCardContentProps {
  project: ProjectData;
}

const SecondaryHeading = styled(Heading)`
  font-family: 'ME', sans-serif !important;
  text-transform: uppercase;
`;

const ProjectCardContent: FC<ProjectCardContentProps> = ({ project }) => {
  return (
    <Flex direction='column' m='4'>
      <SecondaryHeading>{project.title}</SecondaryHeading>
      <Flex direction='row' justify='start' align='center'>
        <Text mb='3' color='yellow' weight='medium'>
          {project.category + ':'}
        </Text>
        <Flex mb='3' ml='2'>
          <Text weight='medium'>
            {project.tags.map((tag, index) => (
              <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                {tag}
              </span>
            ))}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ProjectCardContent;
