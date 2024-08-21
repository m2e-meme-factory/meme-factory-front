import React, { FC } from 'react';
import { Flex } from '@radix-ui/themes';
import styles from './CardBanner.module.css';
import fallbackImg from '../../../../shared/imgs/fallback_img.jpg';
import { FALLBACK_BANNER_URL } from '../../../../shared/consts/fallbackBanner';

interface CardBannerProps {
  bannerUrl?: string;
}

const CardBanner: FC<CardBannerProps> = ({ bannerUrl }) => {
  return (
    <Flex className={styles.bannerContainer}>
      <img
        src={bannerUrl ? `https://api.meme-factory.site${bannerUrl}` : FALLBACK_BANNER_URL}
        className={styles.bannerImage}
        alt={' '}
      />
    </Flex>
  );
};

export default CardBanner;
