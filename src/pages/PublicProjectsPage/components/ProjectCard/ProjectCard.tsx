import { Box, Card, Flex, Heading } from '@radix-ui/themes';
import CardBanner from '../CardBanner/CardBanner';
import ProjectCardContent from '../ProjectCardContent/ProjectCardContent';
import React, { FC } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { Project } from 'api';

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  background-color: var(--gray-a2);
`;

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  // if (project.maxPrice === null && project.minPrice === null) {
  return (
    <StyledCard onClick={() => navigate(`/projects/${project.project.id}`)}>
      <Flex justify='between' gap='4'>
        <CardBanner bannerUrl={project.project.bannerUrl} />
        <Flex direction='column' justify='between' m='4'>
          <Heading size='5'>{project.project.title}</Heading>
          <ProjectCardContent
            project={project.project}
            minPrice={project.minPrice}
            maxPrice={project.maxPrice}
          />
        </Flex>
      </Flex>
    </StyledCard>
  );
  // }

  return (
    <StyledCard onClick={() => navigate(`/projects/${project.project.id}`)}>
      <Flex direction='column' p='4' gap='4'>
        <Heading size='5'>{project.project.title}</Heading>
        <Flex justify='between' gap='4'>
          <CardBanner bannerUrl={project.project.bannerUrl} />
          <ProjectCardContent
            project={project.project}
            minPrice={project.minPrice}
            maxPrice={project.maxPrice}
          />
        </Flex>
      </Flex>
    </StyledCard>
  );
};

export default ProjectCard;
