import React, { useEffect, useState } from 'react';
import { Heading, Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import styles from './../ProfilePage/ProfilePage.module.css';
import { connectWallet } from '../../shared/utils/api/requests/ton/connect';

const ProfileSettingsPage = () => {
  const [walletAddress, setWalletAddress] = useState<string>();

  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    const unsubscribe = tonConnectUI.onStatusChange((wallet) => {
      if (wallet) {
        setWalletAddress(wallet.account.address);
      } else {
        setWalletAddress('');
      }
    });

    return () => unsubscribe();
  }, [tonConnectUI]);

  useEffect(() => {
    const connect = async (wallet: string) => {
      await connectWallet({ params: { tonWalletAddress: wallet } });
    };

    if (walletAddress) {
      console.log(walletAddress);
      connect(walletAddress);
    }
  }, [walletAddress]);

  return (
    <Flex m='4' direction='column'>
      <Flex align='center'>
        <Link to='/profile'>
          <IconButton mr='3' size='2'>
            <ArrowLeftIcon />
          </IconButton>
        </Link>
        <Heading>Profile Settings</Heading>
      </Flex>

      <Card mt='5'>
        <Heading size='2'>Socials</Heading>
        <button className={styles.ConnectButton}>Connect Socials</button>
      </Card>

      <Card mt='5'>
        <Flex align='center' justify='between'>
          <Heading size='2' mr='6'>
            Connect TON Wallet
          </Heading>
          <TonConnectButton />
        </Flex>
      </Card>
    </Flex>
  );
};

export default ProfileSettingsPage;
