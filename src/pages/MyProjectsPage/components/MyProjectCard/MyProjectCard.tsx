import React, { FC } from 'react';
import { Text, Card, Flex, Heading } from '@radix-ui/themes';
import CardBanner from '../../../PublicProjectsPage/components/CardBanner/CardBanner';
import { task } from '../../../../shared/consts/task-example';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';

interface MyProjectCardProps {
  title: string;
  category: string;
  freelancersCount: number;
  status: 'published' | 'on_moderation';
}

const MyProjectCard: FC<MyProjectCardProps> = ({ title, category, freelancersCount, status }) => {
  const navigate = useNavigate();

  const StyledCard = styled(Card)`
    padding: 0;
    margin: 0 0 15px;
    width: 100%;
    background-color: #121212;
  `;

  return (
    <StyledCard onClick={() => navigate('/projects/1')}>
      <Flex direction='column'>
        <CardBanner />
        <Flex direction='column' m='4'>
          <Heading>{task.title}</Heading>
          <Text mb='3' color='yellow' weight='medium'>
            {task.category}
          </Text>
          <Card
            mb='3'
            onClick={(event: React.MouseEvent<HTMLDivElement>) => {
              event.stopPropagation();
              navigate('/about');
            }}
          >
            <Flex direction='column'>
              <Text size='2' color='gray'>
                Freelancers count:
              </Text>
              <Text weight='medium' color='yellow' size='5'>
                {freelancersCount}
              </Text>
            </Flex>
          </Card>
          <Text weight='medium'>Status: {status}</Text>
        </Flex>
      </Flex>
    </StyledCard>
  );
};

export default MyProjectCard;
