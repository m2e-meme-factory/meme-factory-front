import React, { FC, useEffect, useState } from 'react';
import { Text, Card, Flex, Heading, Box } from '@radix-ui/themes';
import CardBanner from '../../../PublicProjectsPage/components/CardBanner/CardBanner';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../shared/utils/redux/store';
import { Role } from '../../../../shared/consts/userRoles';
import { useGetProjectFreelancers } from '../../../../shared/utils/api/hooks/project/useGetProjectFreelancers';
import { ProjectStatus } from '../../../../shared/consts/project-statuses';
import { shortenString } from '../../../../shared/utils/helpers/shortenString';

interface MyProjectCardProps {
  id: string;
  title: string;
  category: string;
  bannerUrl: string;
  status: ProjectStatus;
}

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  background-color: var(--gray-2);
`;

const MyProjectCard: FC<MyProjectCardProps> = ({ id, title, category, bannerUrl, status }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const { data: freelancersResponse } = useGetProjectFreelancers(id, 'accepted');
  const [freelancers, setFreelancersCount] = useState<number>();

  useEffect(() => {
    if (freelancersResponse) {
      setFreelancersCount(freelancersResponse.data.length);
    }
  }, [freelancersResponse]);

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
          <Heading>{shortenString(title, 40)}</Heading>
          <Text mb='3' color='yellow' weight='medium'>
            {category}
          </Text>
          <Card mb='3'>
            <Flex direction='column'>
              <Text size='2' color='gray'>
                Freelancers count:
              </Text>
              <Text weight='medium' color='yellow' size='5'>
                {typeof freelancers === 'number' ? (
                  freelancers
                ) : (
                  <Box
                    width='20px'
                    height='30px'
                    style={{ backgroundColor: 'gray', borderRadius: '5px' }}
                  ></Box>
                )}
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
