import { ScrollArea, Flex, Box, Heading, Card, Button, TextField, Text, Callout, Tabs, Select } from "@radix-ui/themes";
import VideoCard from "../../shared/components/VideoCard";
import { useNavigate } from 'react-router-dom';
import { PropsWithChildren, useState } from "react";
import GlowingButton, { AccentButton } from "../../shared/components/Buttons/GlowingButton";
import { InfoCircleOutlined } from "@ant-design/icons";
import { ROUTES } from "../../shared/consts/routes";
import WebappBackButton from "../../shared/components/WebappBackButton";
import axios from 'axios';
import FileUpload from "./FileUpload";
import { showSuccessMessage } from "../../shared/utils/helpers/notify";

const VIDEO_OVERLAY_API_URL = "https://video-api.egor-jan.tech"
// const VIDEO_OVERLAY_API_URL = "http://127.0.0.1:8000"

const ChangableButton = ({ text, glow, onClick }: {
    text: string;
    glow?: boolean;
    onClick: () => void;
}) => {
    if (glow)
        return (
            <GlowingButton size='3' onClick={onClick}>
                {text}
            </GlowingButton>
        );

    return (
        <></>
    );
}

const Step = ({ children, text, step, currentStep, handleDone, isProgress }: PropsWithChildren<{
    text: string;
    step: number;
    currentStep: number;
    handleDone: () => void;
    isProgress?: boolean
}>) => <>
        <Box>
            <Flex direction='column' gap='4'>
                <Heading weight="bold" style={{ color: currentStep == step ? '#fff' : 'var(--gray-10)' }} >{text}</Heading>
                {currentStep >= step && (
                    <>
                        {children}
                        {(isProgress || isProgress == undefined) &&
                            <ChangableButton glow={currentStep == step} onClick={handleDone} text="Done" />
                        }
                    </>
                )}
            </Flex>
        </Box>
    </>;

export default function PostMemePage() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitedVideo, setIsSubmitedVideo] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);
    const [isDownloaded, setIsDownloaded] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleUploadVideoUrl = async () => {
        if (!videoUrl) {
            setError('Пожалуйста, введите URL видео');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('url', videoUrl);

            const response = await axios.post(VIDEO_OVERLAY_API_URL + '/upload-video-url/', formData);
            const data = response.data;
            if (data.error) {
                setError(data.error);
            } else {
                setFileId(data.file_id);  // Сохраняем file_id
                setIsSubmitedVideo(true);  // Делаем видео отправленным
                setCurrentStep(2);
            }
        } catch (err) {
            setError('Ошибка при загрузке видео');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            setFile(event.target.files[0]);
        }
    };

    const handleUploadVideoFile = async () => {
        if (!file) {
            setError('Пожалуйста, выберите файл');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(VIDEO_OVERLAY_API_URL + '/upload-video/', formData);
            const data = response.data;
            if (data.error) {
                setError(data.error);
            } else {
                setFileId(data.file_id);  // Сохраняем file_id
                setIsSubmitedVideo(true);  // Делаем видео отправленным
                setIsDownloaded(true);
            }
        } catch (err) {
            setError('Ошибка при загрузке файла');
        } finally {
            setLoading(false);
        }
    };

    const handleOverlayVideo = async () => {
        if (!fileId) {
            setError('Не найден file_id');
            return;
        }
        setLoading(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append('file_id', fileId);

            const response = await axios.post(VIDEO_OVERLAY_API_URL + '/overlay-video/', formData, {
                responseType: 'blob',  // Важное изменение: ожидаем получение файла как Blob
            });

            const downloadUrl = URL.createObjectURL(response.data);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `${fileId}_overlayed.mp4`;  // Задаём имя для скачиваемого файла
            link.click();  // Имитируем клик по ссылке для начала скачивания

            setIsDownloaded(true)
        } catch (err) {
            setError('Ошибка при обработке видео');
        } finally {
            setLoading(false);
        }
    };


    const [copyText, setCopyText] = useState("Copy")

    const handleCopyText = (text: string) => {
        const textToCopy = text;

        if (navigator.clipboard) {
            navigator.clipboard
                .writeText(textToCopy)
                .then(() => {
                    showSuccessMessage('Copied');
                    setCopyText('Copied');

                    setTimeout(() => {
                        setCopyText('Copy');
                    }, 5000);
                })
                .catch(() => {
                    console.error('Clipboard copy failed, using fallback method.');
                    copyFallback(textToCopy);
                });
        }
    };

    const copyFallback = (text: string) => {
        const tempInput = document.createElement('input');
        tempInput.value = text;
        document.body.appendChild(tempInput);
        tempInput.select();
        tempInput.setSelectionRange(0, text.length);

        try {
            document.execCommand('copy');
            showSuccessMessage('Copied!');
            setCopyText('Copied');

            setTimeout(() => {
                setCopyText('Copy');
            }, 5000);
        } catch (error) {
            console.error('Fallback copy failed.', error);
        }

        document.body.removeChild(tempInput);
    };


    return (
        <ScrollArea style={{ maxHeight: "100vh" }}>
            <WebappBackButton />
            <Flex asChild p="4" pt='3' pb="6" gap="6" direction="column">
                <Box>
                    <Step
                        text="1. Watch guide"
                        step={0}
                        currentStep={currentStep}
                        handleDone={() => setCurrentStep(1)}
                    >
                        <VideoCard videoSrc={process.env.PUBLIC_URL + '/video/about.mp4'} thumbnailSrc={process.env.PUBLIC_URL + '/imgs/thumbnail.png'} altText='Tutorial' />
                    </Step>
                    <Step
                        text="2. Upload video"
                        step={1}
                        currentStep={currentStep}
                        handleDone={() => setCurrentStep(2)}
                        isProgress={isSubmitedVideo}
                    >
                        {!isSubmitedVideo ? (
                            <Card>
                                <Tabs.Root defaultValue="web">
                                    <Tabs.List>
                                        <Tabs.Trigger value="web">From Link</Tabs.Trigger>
                                        <Tabs.Trigger value="local">Upload Local</Tabs.Trigger>
                                    </Tabs.List>

                                    <Box pt="3">
                                        <Tabs.Content value="web">
                                            <Flex direction="column" gap="2">
                                                <TextField.Root size="3" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="Paste Meme URL" />

                                                <Button color="amber" onClick={handleUploadVideoUrl} size="3" disabled={loading}>Proceed</Button>
                                            </Flex>
                                        </Tabs.Content>

                                        <Tabs.Content value="local">
                                            <Flex direction="column" gap="2">
                                                <FileUpload onChange={handleFileChange} />
                                                {
                                                    (file != null) && (
                                                        <Button color="amber" onClick={handleUploadVideoFile} size="3" disabled={loading}>Upload</Button>
                                                    )
                                                }
                                            </Flex>
                                        </Tabs.Content>
                                    </Box>
                                </Tabs.Root>
                            </Card>
                        ) : (
                            <Callout.Root color="green">
                                <Callout.Icon>
                                    <InfoCircleOutlined />
                                </Callout.Icon>
                                <Callout.Text>
                                    Video was uploaded
                                </Callout.Text>
                            </Callout.Root>
                        )}
                    </Step>
                    <Step
                        text="3. Select language"
                        step={2}
                        currentStep={currentStep}
                        handleDone={() => setCurrentStep(3)}
                        isProgress={isDownloaded}
                    >
                        <Card>
                            <Flex direction="column" gap="4">
                                <Text>Select language</Text>

                                <Select.Root defaultValue="en">
                                    <Select.Trigger />
                                    <Select.Content>
                                        <Select.Item value="en">English</Select.Item>
                                        <Select.Item value="ru">Russian</Select.Item>
                                    </Select.Content>
                                </Select.Root>

                                <AccentButton style={{ width: "100%" }} onClick={handleOverlayVideo} size="3" disabled={loading}>
                                    {loading ? 'Processing Video...' : 'Download Video'}
                                </AccentButton>
                            </Flex>
                        </Card>
                    </Step>
                    <Step
                        text="4. Upload to Instagram"
                        step={3}
                        currentStep={currentStep}
                        handleDone={() => setCurrentStep(4)}
                    >
                        {fileId && !loading && (
                            <Card>
                                <Flex direction="column" gap="4">
                                    <Text>Copy this description and upload video to your Instagram account</Text>
                                    <Callout.Root color="gray">
                                        Join Meme to Earn - link in account bio
                                    </Callout.Root>
                                    <Button onClick={() => handleCopyText("Join Meme to Earn - link in account bio")} color="gray" size="3">{copyText}</Button>
                                </Flex>
                            </Card>
                        )}
                    </Step>
                    <Step
                        text="5. Complete & Wait"
                        step={4}
                        currentStep={currentStep}
                        handleDone={() => navigate(ROUTES.ALL_TASKS)}
                    >
                        <Card>
                            <Flex direction="column" gap="4">
                                <Callout.Root color="gray">
                                    Now Just Wait until your Meme reach {">"}10K views and <b>send video on Review</b>
                                </Callout.Root>

                                <Callout.Root color="red">
                                    <Callout.Icon>
                                        <InfoCircleOutlined />
                                    </Callout.Icon>
                                    <Callout.Text>
                                        Wait until it gets as many views as possible, because you can send video only once.
                                    </Callout.Text>
                                </Callout.Root>
                            </Flex>
                        </Card>
                    </Step>
                </Box>
            </Flex>
        </ScrollArea>
    );
}
