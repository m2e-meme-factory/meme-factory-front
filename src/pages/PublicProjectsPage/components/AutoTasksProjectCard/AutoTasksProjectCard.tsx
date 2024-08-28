import styled from 'styled-components';
import { Card, Flex, Heading, Text } from '@radix-ui/themes';
import CardBanner from '../CardBanner/CardBanner';
import ProjectCardContent from '../ProjectCardContent/ProjectCardContent';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TagsOutlined } from '@ant-design/icons';

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  border: 1px solid yellow;
  background-color: #121212;
`;

const AutoTasksProjectCard = () => {
  const navigate = useNavigate();

  return (
    <StyledCard onClick={() => navigate(`/projects/autotasks`)}>
      <Flex direction='column'>
        <CardBanner />
        <Flex direction='column' m='4'>
          <Heading>Points for activity!</Heading>
          <Text mb='3' color='yellow' weight='medium'>
            Platform tasks
          </Text>
          <Flex mb='3'>
            <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium'>
              Tags:{' '}
              {['partnership', 'socials'].map((tag, index) => (
                <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                  {tag}
                </span>
              ))}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </StyledCard>
  );
};

export default AutoTasksProjectCard;
