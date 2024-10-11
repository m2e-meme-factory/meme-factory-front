import { Box, Flex, Heading, Button, Badge, Card, DataList, Grid, Link, Text, Skeleton, AlertDialog } from "@radix-ui/themes";
import GlowingButton from "../../shared/components/Buttons/GlowingButton";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useState, useEffect } from "react";
import { connectWallet } from "../../shared/utils/api/requests/ton/connect";
import { ResponsibleImage } from "../../shared/components/ResponsibleImage";
import money from "../../shared/imgs/money-bag.webp";
import { useSelector } from "react-redux";
import { useGetRefData } from "../../shared/utils/api/hooks/user/useGetRefData";
import { RootState } from "../../shared/utils/redux/store";
import WebappBackButton from "../../shared/components/WebappBackButton";


const WalletPage = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const [tonConnectUI] = useTonConnectUI();
  const [walletAddress, setWalletAddress] = useState<string>();

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
      connect(walletAddress);
    }
  }, [walletAddress]);

    return (
        <Flex direction="column" minHeight="90vh" justify="center" align="center" m="4" gap="4">
            <WebappBackButton />
            <ResponsibleImage src={money} />

            <Heading align="center" size="8">Connect Wallet</Heading>

            <Box asChild width="100%">

                <Card mt="4" >
                    <Grid gap='4'>
                        <Flex direction='column'>
                            <Heading>Available Balance</Heading>
                            <Skeleton width='8' loading={!user}>
                                <Flex
                                    gapX='3'
                                    direction='row'
                                    align='center'
                                    style={{ width: 'fit-content', borderRadius: '5px' }}
                                >
                                    <Text>{user?.balance ?? '0'}</Text>{' '}
                                    <Badge color='bronze'>M2E</Badge>
                                </Flex>
                            </Skeleton>
                        </Flex>
                        {
                            tonConnectUI.connected ? (
                                <AlertDialog.Root>
                                    <AlertDialog.Trigger>
                                        <Button size="4" style={{ backgroundColor: 'var(--gray-6)', color: 'var(--gray-11)' }}>
                                            {tonConnectUI.account?.address.slice(0, 6) + "..." || "Disconect"}
                                        </Button>
                                    </AlertDialog.Trigger>
                                    <AlertDialog.Content maxWidth="450px">
                                        <AlertDialog.Title>Diconnect Wallet?</AlertDialog.Title>
                                        <Flex gap="3" mt="4" justify="end">
                                            <AlertDialog.Cancel>
                                                <Button variant="soft" color="gray">
                                                    Cancel
                                                </Button>
                                            </AlertDialog.Cancel>
                                            <AlertDialog.Action>
                                                <Button variant="solid" color="red" onClick={() => tonConnectUI.disconnect()}>
                                                    Disconnect
                                                </Button>
                                            </AlertDialog.Action>
                                        </Flex>
                                    </AlertDialog.Content>
                                </AlertDialog.Root>
                            ) : (
                                <GlowingButton size="4" onClick={() => tonConnectUI.modal.open()}>
                                    Connect
                                </GlowingButton>
                            )
                        }
                    </Grid>
                </Card>
            </Box>
        </Flex>
    )
}


export default WalletPage;
