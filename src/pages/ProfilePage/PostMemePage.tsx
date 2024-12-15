import { ScrollArea, Flex, Box, Heading, Card, Button, TextField, Text, Callout } from "@radix-ui/themes";
import VideoCard from "../../shared/components/VideoCard";
import { useNavigate } from 'react-router-dom';
import { PropsWithChildren, useState } from "react";
import GlowingButton from "../../shared/components/Buttons/GlowingButton";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ROUTES } from "../../shared/consts/routes";
import WebappBackButton from "../../shared/components/WebappBackButton";



const ChangableButton = ({ text, glow, onClick }: {
    text: string
    glow?: boolean
    onClick: () => void
}) => {
    if (glow)
        return (
            <GlowingButton size='3' onClick={onClick}>
                {text}
            </GlowingButton>
        )

    return (
        <></>
    )
}

const Step = ({ children, text, step, currentStep, handleDone }: PropsWithChildren<{
    text: string
    step: number
    currentStep: number
    handleDone: () => void
}>) => <>
        <Box>
            <Flex direction='column' gap='4'>
                <Heading weight="bold" style={{ color: currentStep == step ? '#fff' : 'var(--gray-10)' }} >{text}</Heading>
                {currentStep >= step && (
                    <>
                        {children}
                        <ChangableButton glow={currentStep == step} onClick={handleDone} text="Done" />
                    </>
                )}
            </Flex>
        </Box>
    </>;

export default function PostMemePage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitedVideo, setIsSubmitedVideo] = useState(false);

    return (
        <ScrollArea style={{ maxHeight: "100vh" }}>
            <WebappBackButton />
            <Flex asChild p="4" pt='3' pb="6" gap="6" direction="column">
                <Box>
                    <Step
                        text="1. Whatch guide"
                        step={0}
                        currentStep={currentStep}
                        handleDone={() => setCurrentStep(1)}
                    >
                        <VideoCard videoSrc={process.env.PUBLIC_URL + '/video/about.mp4'} thumbnailSrc={process.env.PUBLIC_URL + '/imgs/thumbnail.png'} altText='Tutorial' />
                    </Step>
                    <Step
                        text="2. Paste Meme URL"
                        step={1}
                        currentStep={currentStep}
                        handleDone={() => setCurrentStep(2)}
                    >
                        <Card>
                            <Flex direction="column" gap="2">
                                {!isSubmitedVideo ? (
                                    <>
                                        <TextField.Root size="3" value="" onChange={() => { }} placeholder="Paste Meme URL" />
                                        <Button color="amber" onClick={() => setIsSubmitedVideo(true)} size="3">Submit</Button>
                                    </>
                                ) : (
                                    <Button color="gray" onClick={() => setIsSubmitedVideo(true)} size="3">Download Video</Button>
                                )}
                            </Flex>
                        </Card>
                    </Step>
                    <Step
                        text="3. Upload Video On Instagram"
                        step={2}
                        currentStep={currentStep}
                        handleDone={() => setCurrentStep(3)}
                    >

                        <Card>
                            <Flex direction="column" gap="4">
                                <Text>Set this text as video description:</Text>
                                <Callout.Root color="gray">
                                    Join Meme to Earn - link in accont bio
                                </Callout.Root>
                                <Button color="gray" size="3">Copy</Button>
                            </Flex>
                        </Card>
                    </Step>
                    <Step
                        text="4. Complete & Wait"
                        step={3}
                        currentStep={currentStep}
                        handleDone={() => navigate(ROUTES.ALL_TASKS)}
                    >
                        <Card>
                            <Flex direction="column" gap="4">
                                <Callout.Root color="gray">
                                    Now Just Wait until your Meme gets {">"}10K views
                                </Callout.Root>

                                <Callout.Root color="red">
                                    <Callout.Icon>
                                        <InfoCircleOutlined />
                                    </Callout.Icon>
                                    <Callout.Text>
                                        Wait unitl it gets as much views as possible, because you can send video only once
                                    </Callout.Text>
                                </Callout.Root>

                                <Callout.Root color="gray">
                                    After that you should approve your video with moderation <b>(Earn Money)</b>
                                </Callout.Root>
                            </Flex>
                        </Card>
                    </Step>
                </Box>
            </Flex>
        </ScrollArea>
    )
}