import { Box, Flex, Heading, Button, Badge, Card, DataList, Grid, Link, Text, Skeleton } from "@radix-ui/themes";
import GlowingButton from "../../shared/components/Buttons/GlowingButton";
import { useTonConnectUI } from "@tonconnect/ui-react";
import { useState, useEffect } from "react";
import { connectWallet } from "../../shared/utils/api/requests/ton/connect";
import { ResponsibleImage } from "../../shared/components/ResponsibleImage";
import money from "../../shared/imgs/money-bag.webp";
import { useSelector } from "react-redux";
import { useGetRefData } from "../../shared/utils/api/hooks/user/useGetRefData";
import { RootState } from "../../shared/utils/redux/store";


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
                            <Button size="4" color='gray' onClick={() => tonConnectUI.disconnect()}>
                                {tonConnectUI.account?.address || "Disconect"}
                            </Button>
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