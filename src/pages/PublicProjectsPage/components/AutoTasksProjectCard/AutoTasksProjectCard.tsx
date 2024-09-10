import styled from 'styled-components';
import { Button, Card, Flex, Heading, Text } from '@radix-ui/themes';
import CardBanner from '../CardBanner/CardBanner';
import ProjectCardContent from '../ProjectCardContent/ProjectCardContent';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TagsOutlined } from '@ant-design/icons';

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  border: 1px solid var(--yellow-9);
  background-color: #121212;
`;

const SecondaryHeading = styled(Heading)`
  font-family: var(--default-font) !important;
  text-transform: none;
`

const AutoTasksProjectCard = () => {
  const navigate = useNavigate();

  return (
    <StyledCard variant='classic' onClick={() => navigate(`/projects/autotasks`)}>
      <Flex direction='column'>
        <CardBanner />
        <Flex direction='column' m='4'>
          <SecondaryHeading>Airdrop Tasks</SecondaryHeading>
          {/* <Text mb='3' color='yellow' weight='medium'>
            Platform tasks
          </Text> */}
          {/* <Flex mb='3'>
            <TagsOutlined style={{ color: 'yellow', marginRight: '8px' }} />
            <Text weight='medium'>
              Tags:{' '}
              {['partnership', 'socials'].map((tag, index) => (
                <span key={index} style={{ marginLeft: index > 0 ? '8px' : '0' }}>
                  {tag}
                </span>
              ))}
            </Text>
          </Flex> */}
        </Flex>
      </Flex>
    </StyledCard>
  );
};

export default AutoTasksProjectCard;
