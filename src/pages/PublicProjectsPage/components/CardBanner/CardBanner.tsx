import { FC } from 'react';
import { Flex } from '@radix-ui/themes';
import styles from './CardBanner.module.css';
import fallbackBanner from './../../../../shared/imgs/fallbackBanner.png';
import { env } from '@shared/consts/env';

interface CardBannerProps {
  bannerUrl?: string;
}

const CardBanner: FC<CardBannerProps> = ({ bannerUrl }) => {
  return (
    <Flex className={styles.bannerContainer}>
      <img
        src={bannerUrl ? `${env.baseUrl}${bannerUrl}` : fallbackBanner}
        className={styles.bannerImage}
        alt={' '}
      />
    </Flex>
  );
};

export default CardBanner;
