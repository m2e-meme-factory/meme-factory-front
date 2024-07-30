import React from "react";
import {Flex} from "@radix-ui/themes";
import styles from './CardBanner.module.css'

const IMAGE_URL = 'https://cdna.artstation.com/p/assets/images/images/012/308/904/large/divya-jain-firewatch-dhj.jpg?1534140299';

const CardBanner = () => {
    return (
        <Flex className={styles.bannerContainer}>
            <img src={IMAGE_URL} alt="CardBannerImage" className={styles.bannerImage}/>
        </Flex>
    );
}

export default CardBanner;
