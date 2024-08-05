import { Card, Flex } from '@radix-ui/themes';
import CardBanner from '../CardBanner/CardBanner';
import ProjectCardContent from '../ProjectCardContent/ProjectCardContent';
import React from 'react';
import styled from 'styled-components';

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  background-color: #121212;
`;

const ProjectCard = () => {
  return (
    <StyledCard>
      <Flex direction='column'>
        <CardBanner />
        <ProjectCardContent />
      </Flex>
    </StyledCard>
  );
};

export default ProjectCard;
