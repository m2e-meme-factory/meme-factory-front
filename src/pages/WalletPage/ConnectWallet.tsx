import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTonConnectUI } from '@tonconnect/ui-react';
import { connectWallet } from '../../shared/utils/api/requests/ton/connect';
import {
    Grid,
    Card,
    Heading,
    Flex,
    Button,
    Box,
    AlertDialog,
} from '@radix-ui/themes';
import GlowingButton from '../../shared/components/Buttons/GlowingButton';


export default function ConnectWallet({onSuccess}: {onSuccess?: (value: string) => void}) {
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
            
            if (onSuccess) {
                onSuccess(wallet);
            }
        };

        if (walletAddress) {
            connect(walletAddress);
        }
    }, [walletAddress]);

    return (
        <Box asChild width='100%'>
            <Card>
                <Grid gap='4'>
                    <Box>Connect Wallet</Box>
                    {tonConnectUI.connected ? (
                        <AlertDialog.Root>
                            <AlertDialog.Trigger>
                                <Button
                                    size='4'
                                    style={{
                                        backgroundColor: 'var(--gray-6)',
                                        color: 'var(--gray-11)',
                                    }}
                                >
                                    {'Connected: ' +
                                        tonConnectUI.account?.address.slice(0, 3) +
                                        '...' +
                                        tonConnectUI.account?.address.slice(
                                            tonConnectUI.account?.address.length - 3,
                                            tonConnectUI.account?.address.length
                                        ) || 'Disconnect'}
                                </Button>
                            </AlertDialog.Trigger>
                            <AlertDialog.Content maxWidth='450px'>
                                <AlertDialog.Title>Diconnect Wallet?</AlertDialog.Title>
                                <Flex gap='3' mt='4' justify='end'>
                                    <AlertDialog.Cancel>
                                        <Button variant='soft' color='gray'>
                                            Cancel
                                        </Button>
                                    </AlertDialog.Cancel>
                                    <AlertDialog.Action>
                                        <Button
                                            variant='solid'
                                            color='red'
                                            onClick={() => tonConnectUI.disconnect()}
                                        >
                                            Disconnect
                                        </Button>
                                    </AlertDialog.Action>
                                </Flex>
                            </AlertDialog.Content>
                        </AlertDialog.Root>
                    ) : (
                        <GlowingButton size='4' onClick={() => tonConnectUI.modal.open()}>
                            Connect
                        </GlowingButton>
                    )}
                </Grid>
            </Card>
        </Box>
    );
}
