import { Card, Flex } from '@radix-ui/themes';
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
  background-color: #121212;
`;

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: FC<ProjectCardProps> = ({ project }) => {
  const navigate = useNavigate();

  return (
    <StyledCard onClick={() => navigate(`/projects/${project.id}`)}>
      <Flex direction='column'>
        <CardBanner bannerUrl={project.bannerUrl} />
        <ProjectCardContent project={project} />
      </Flex>
    </StyledCard>
  );
};

export default ProjectCard;
