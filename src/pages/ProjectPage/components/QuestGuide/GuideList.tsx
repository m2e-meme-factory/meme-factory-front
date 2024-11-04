import { Badge, Box, Card, Flex, Text } from "@radix-ui/themes"
import yeyEmoji from '../../../../shared/imgs/yey.png';

export const GuideList = () => {
    return (
        <Flex direction='column' gap='2'>
            <Card>
                <Flex gap='4' align='center' p='1'>
                    <Box>
                        <Text size='8' weight='bold'>
                            1
                        </Text>
                    </Box>
                    <Box>
                        <Box>Join Quest</Box>
                        <Box>
                            <Text size='1' color='gray'>
                                Join Quest with message based on requirements
                            </Text>
                        </Box>
                    </Box>
                </Flex>
            </Card>

            <Card>
                <Flex gap='4' align='center' p='1'>
                    <Box>
                        <Text size='8' weight='bold'>
                            2
                        </Text>
                    </Box>
                    <Box>
                        <Box>Await Approval</Box>
                        <Box>
                            <Text size='1' color='gray'>
                                Wait until the advertiser approves
                            </Text>
                        </Box>
                    </Box>
                </Flex>
            </Card>

            <Card>
                <Flex gap='4' align='center' p='1'>
                    <Box>
                        <Text size='8' weight='bold'>
                            3
                        </Text>
                    </Box>
                    <Flex justify='between' width='100%' align='center'>
                        <Box>
                            <Box>Complete Tasks</Box>
                            <Box>
                                <Text size='1' color='gray'>
                                    Complete listed tasks
                                </Text>
                            </Box>
                        </Box>
                    </Flex>
                </Flex>
            </Card>

            <Card>
                <Flex gap='4' align='center' p='1'>
                    <Box>
                        <Text size='8' weight='bold'>
                            4
                        </Text>
                    </Box>
                    <Flex justify='between' width='100%' align='center'>
                        <Box>
                            <Box>Get Reward</Box>
                            <Box>
                                <Text size='1' color='gray'>
                                    Get <Badge color='bronze'>M2E</Badge> for each completed task
                                </Text>
                            </Box>
                        </Box>
                        <img
                            style={{
                                height: 'var(--font-size-8)',
                            }}
                            src={yeyEmoji}
                        />
                    </Flex>
                </Flex>
            </Card>
        </Flex>
    )
}