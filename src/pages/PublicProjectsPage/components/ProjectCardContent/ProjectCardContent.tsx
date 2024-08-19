import { Flex, Heading, Text } from '@radix-ui/themes';
import styled from 'styled-components';
import { DollarOutlined, TagsOutlined } from '@ant-design/icons';
import React, { FC } from 'react';
import { Project } from 'api';

const TaskContentHeading = styled(Heading)`
  color: black;
`;

const TaskContentText = styled(Text)`
  color: ${(props) => props.color || 'black'};
  weight: ${(props) => props.weight || 'regular'};
`;

interface ProjectCardContentProps {
  project: Project;
}

const ProjectCardContent: FC<ProjectCardContentProps> = ({ project }) => {
  return (
    <Flex direction='column' m='4'>
      <Heading>{project.title}</Heading>
      <Text mb='3' color='yellow' weight='medium'>
        {project.category}
      </Text>
      <Flex mb='3'>
        <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
        <Text weight='medium'>
          Tags:{' '}
          {project.tags.map((tag, index) => (
            <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
              {tag}
            </span>
          ))}
        </Text>
      </Flex>
    </Flex>
  );
};

export default ProjectCardContent;
