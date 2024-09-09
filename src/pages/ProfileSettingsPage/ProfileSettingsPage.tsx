import React, { useEffect, useState } from 'react';
import { Heading, Card, Flex, IconButton, Text, Dialog, Button } from '@radix-ui/themes';
import { Link } from 'react-router-dom';
import { ArrowLeftIcon } from '@radix-ui/react-icons';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import styles from './../ProfilePage/ProfilePage.module.css';
import { connectWallet } from '../../shared/utils/api/requests/ton/connect';
import '../ProjectPage/components/SubtaskCard/index.css';
import { useVerifyUser } from '../../shared/utils/api/hooks/user/useVerifyUser';
import { useSelector } from 'react-redux';
import { RootState } from '../../shared/utils/redux/store';

const ProfileSettingsPage = () => {
  const [walletAddress, setWalletAddress] = useState<string>();
  const user = useSelector((state: RootState) => state.user.user);
  const [tonConnectUI] = useTonConnectUI();

  const verifyMutation = useVerifyUser();

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

  const handleVerify = () => {
    if (user) {
      verifyMutation.mutate({ params: { telegramId: user.telegramId } });
    }
  };

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
        <Heading size='4'>Socials</Heading>
        <button className={styles.ConnectButton}>Connect Socials</button>
      </Card>

      <Card mt='5'>
        <Heading size='4'>Verify</Heading>
        <Text color='gray' size='2'>
          Verified users have auto approve for any project apply and have 100% chance for receiving
          airdrop. Instant verification price: 5 USDT
        </Text>

        <Dialog.Root>
          <Dialog.Trigger>
            <button className={styles.ConnectButton}>Verify now</button>
          </Dialog.Trigger>

          <Dialog.Content maxWidth='450px'>
            <Dialog.Title>Verify now</Dialog.Title>
            <Dialog.Description size='2' mb='4'>
              Are you sure you want to verify your profile?
            </Dialog.Description>

            <Flex gap='3' mt='4' justify='end'>
              <Dialog.Close>
                <Button variant='soft' color='gray'>
                  Cancel
                </Button>
              </Dialog.Close>
              <Dialog.Close>
                <Button onClick={handleVerify}>Verify</Button>
              </Dialog.Close>
            </Flex>
          </Dialog.Content>
        </Dialog.Root>
      </Card>

      <Card mt='5'>
        <Flex align='center' justify='between'>
          <Heading size='4' mr='6'>
            Connect TON Wallet
          </Heading>
          <TonConnectButton />
        </Flex>
      </Card>
    </Flex>
  );
};

export default ProfileSettingsPage;
