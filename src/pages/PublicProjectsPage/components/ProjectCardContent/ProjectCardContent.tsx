import { Flex, Heading, Text } from '@radix-ui/themes';
import { task } from '../../../../shared/consts/task-example';
import styled from 'styled-components';
import { DollarOutlined, TagsOutlined } from '@ant-design/icons';
import React from 'react';

const TaskContentHeading = styled(Heading)`
  color: black;
`;

const TaskContentText = styled(Text)`
  color: ${(props) => props.color || 'black'};
  weight: ${(props) => props.weight || 'regular'};
`;

const ProjectCardContent = () => {
  return (
    <Flex direction='column' m='4'>
      <Heading>{task.title}</Heading>
      <Text mb='3' color='yellow' weight='medium'>
        {task.category}
      </Text>
      <Flex mb='3'>
        <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
        <Text weight='medium'>
          Tags:{' '}
          {task.tags.map((tag, index) => (
            <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
              {tag}
            </span>
          ))}
        </Text>
      </Flex>
      <Flex>
        <DollarOutlined style={{ color: 'yellow', marginRight: '8px' }} />
        <Text weight='medium'>Price: 1000$</Text>
      </Flex>
    </Flex>
  );
};

export default ProjectCardContent;
