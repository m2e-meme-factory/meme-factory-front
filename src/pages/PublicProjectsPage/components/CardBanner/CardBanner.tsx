import React, { FC } from 'react';
import { Flex } from '@radix-ui/themes';
import styles from './CardBanner.module.css';
import fallbackBanner from './../../../../shared/imgs/fallbackBanner.png';
import { BASE_URL } from '../../../../shared/consts/baseURL';

interface CardBannerProps {
  bannerUrl?: string;
}

const CardBanner: FC<CardBannerProps> = ({ bannerUrl }) => {
  return (
    <Flex className={styles.bannerContainer}>
      <img
        src={bannerUrl ? `${BASE_URL}${bannerUrl}` : fallbackBanner}
        className={styles.bannerImage}
        alt={' '}
      />
    </Flex>
  );
};

export default CardBanner;
