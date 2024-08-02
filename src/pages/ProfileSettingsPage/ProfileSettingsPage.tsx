import { Box, Tabs, Heading, Card, Flex, IconButton } from '@radix-ui/themes';
import React from 'react';
import styles from './../ProfilePage/ProfilePage.module.css';
import { useNavigate } from 'react-router-dom';

const ProfileSettingsPage = () => {
  const navigate = useNavigate();

  return (
    <>
      <Tabs.Root defaultValue='settings'>
        <Tabs.List justify='center'>
          <Tabs.Trigger value='settings'>Settings</Tabs.Trigger>
          <Tabs.Trigger value='socials'>Socials</Tabs.Trigger>
          <Tabs.Trigger value='wallet'>Wallet</Tabs.Trigger>
        </Tabs.List>

        <Box pt='3'>
          <Tabs.Content value='settings'>
            <Flex m='4'>
              <Heading>Edit profile</Heading>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value='socials'>
            <Card m='4'>
              <Heading>Socials</Heading>
              <button className={styles.ConnectButton}>Connect Socials</button>
            </Card>
          </Tabs.Content>

          <Tabs.Content value='wallet'>
            <Card m='4'>
              <Heading>Wallet</Heading>
              <button className={styles.ConnectButton}>Connect Wallet</button>
            </Card>
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </>
  );
};

export default ProfileSettingsPage;
