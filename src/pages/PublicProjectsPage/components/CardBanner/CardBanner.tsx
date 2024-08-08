import React, { FC } from 'react';
import { Flex } from '@radix-ui/themes';
import styles from './CardBanner.module.css';

const FALLBACK_IMAGE =
  'https://cdna.artstation.com/p/assets/images/images/012/308/904/large/divya-jain-firewatch-dhj.jpg?1534140299';

interface CardBannerProps {
  bannerUrl?: string;
}

const CardBanner: FC<CardBannerProps> = ({ bannerUrl }) => {
  return (
    <Flex className={styles.bannerContainer}>
      <img src={bannerUrl ? bannerUrl : FALLBACK_IMAGE} className={styles.bannerImage} alt={' '} />
    </Flex>
  );
};

export default CardBanner;
