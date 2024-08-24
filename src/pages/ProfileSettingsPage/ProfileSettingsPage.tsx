import { Heading, Card, Flex, IconButton } from '@radix-ui/themes';
import React from 'react';
import styles from './../ProfilePage/ProfilePage.module.css';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

const ProfileSettingsPage = () => {
  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <Link to='/profile'>
          <IconButton mr='3' size='2'>
            <ArrowLeftIcon></ArrowLeftIcon>
          </IconButton>
        </Link>
        <Heading>Profile Settings</Heading>
      </Flex>
      <Card mt='5'>
        <Heading>Socials</Heading>
        <button className={styles.ConnectButton}>Connect Socials</button>
      </Card>
      <Card mt='5'>
        <Heading>Wallet</Heading>
        <button className={styles.ConnectButton}>Connect Wallet</button>
      </Card>
    </Flex>
  );
};

export default ProfileSettingsPage;
