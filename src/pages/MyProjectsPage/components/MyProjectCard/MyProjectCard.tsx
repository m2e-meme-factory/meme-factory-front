import React, { FC } from 'react';
import { Text, Card, Flex, Heading } from '@radix-ui/themes';
import CardBanner from '../../../PublicProjectsPage/components/CardBanner/CardBanner';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { ProjectStatus } from 'api';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../shared/utils/redux/store';
import { Role } from '../../../../shared/consts/userRoles';

interface MyProjectCardProps {
  id: string;
  title: string;
  category: string;
  freelancersCount: number;
  bannerUrl: string;
  status: ProjectStatus;
}

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  background-color: #121212;
`;

const MyProjectCard: FC<MyProjectCardProps> = ({
  id,
  title,
  category,
  freelancersCount,
  bannerUrl,
  status,
}) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const handleClick = () => {
    if (user) {
      if (user.role === Role.ADVERTISER) {
        navigate(`/projects/${id}/details`);
      } else {
        navigate(`/projects/${id}/logs/${user.id}`);
      }
    }
  };

  return (
    <StyledCard onClick={handleClick}>
      <Flex direction='column'>
        <CardBanner bannerUrl={bannerUrl} />
        <Flex direction='column' m='4'>
          <Heading>{title}</Heading>
          <Text mb='3' color='yellow' weight='medium'>
            {category}
          </Text>
          <Card mb='3'>
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
