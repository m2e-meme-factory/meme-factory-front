import React, { FC } from 'react';
import { Text, Card, Flex, Heading } from '@radix-ui/themes';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../shared/utils/redux/store';
import { Role } from '../../../../shared/consts/userRoles';
import { shortenString } from '../../../../shared/utils/helpers/shortenString';
import styles from './BannerSection.module.css';
import { BASE_URL } from '../../../../shared/consts/baseURL';
import fallbackBanner from '../../../../shared/imgs/fallbackBanner.png';

interface MyProjectCardProps {
  id: string;
  title: string;
  category: string;
  bannerUrl: string;
}

const StyledCard = styled(Card)`
  padding: 0;
  margin: 0 0 15px;
  width: 100%;
  background-color: var(--gray-2);
`;

const MyProjectCardForCreator: FC<MyProjectCardProps> = ({ id, title, category, bannerUrl }) => {
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.user.user);
  const handleClick = () => {
    if (user) {
      if (user.role === Role.ADVERTISER) {
        navigate(`/projects/${id}/details`);
      } else {
        navigate(`/projects/${id}/logs/${user.id}?fromTab=myprojects`);
      }
    }
  };

  return (
    <StyledCard onClick={handleClick}>
      <Flex direction='column'>
        <Flex className={styles.bannerContainer}>
          <img
            src={bannerUrl ? `${BASE_URL}${bannerUrl}` : fallbackBanner}
            className={styles.bannerImage}
            alt={' '}
          />
        </Flex>
        <Flex direction='column' m='4'>
          <Heading>{shortenString(title, 40)}</Heading>
          <Text mb='3' color='yellow' weight='medium'>
            {category}
          </Text>
        </Flex>
      </Flex>
    </StyledCard>
  );
};

export default MyProjectCardForCreator;
