import { ScrollArea, Flex, Box, Heading, Card, Button, TextField, Text, Callout, Tabs, Select, Badge, Grid, Theme } from "@radix-ui/themes";
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
import Header from "./Header";
import { useWebApp } from "@vkruglikov/react-telegram-web-app";
import { Sheet } from "react-modal-sheet";
import CoinbagAnimated from "../../shared/components/LottieIcons/Coinbag/CoinbagAnimated";
import yeyEmoji from '../../shared/imgs/yey.png';
import styled from "styled-components";
import { SolidCard } from "../../shared/components/Card/SolidCard";

const VIDEO_OVERLAY_API_URL = "https://video-api.egor-jan.tech"
// const VIDEO_OVERLAY_API_URL = "http://127.0.0.1:8000"

const ChangableButton = ({ text, glow, onClick, disabled }: {
    text: string;
    glow?: boolean;
    disabled?: boolean;
    onClick: () => void;
}) => {
    if (glow)
        return (
            <GlowingButton disabled={disabled} size='4' onClick={onClick}>
                {text}
            </GlowingButton>
        );

    return (
        <></>
    );
}


const NftCard = styled(SolidCard) <{ glowing: boolean }>`
  height: 15vh;
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: space-between; */
  transition: ease .2s;

  &:active {
    cursor: pointer;
    transform: scale(0.8)
  }
  animation: glow 3s ease-in-out infinite alternate;
  

  @keyframes glow {
    0% {
      box-shadow: 0px 0px 20px 0px var(--brand-color);
    }

    50% {
      box-shadow: 0px 0px 20px -20px var(--brand-color);
    }

    100% {
      box-shadow: 0px 0px 20px 0px var(--brand-color);
    }
  }
`;


const ImgWrapper = styled(Flex)<{opacity: number}>`
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  height: 17vh;
  position: absolute;
  bottom: -10px;
  right: -5px;
  opacity: ${props => props.opacity};
`

const Step = ({ children, text, step, currentStep, handleDone, isProgress, btnText }: PropsWithChildren<{
    text: string;
    step: number;
    currentStep: number;
    handleDone: () => void;
    isProgress?: boolean,
    btnText?: string
}>) => <>
        <Box>
            <Flex direction='column' gap='4'>
                <Heading weight="bold" style={{ color: currentStep == step ? '#fff' : 'var(--gray-10)' }} >{text}</Heading>
                {currentStep >= step && (
                    <>
                        {children}
                            <ChangableButton disabled={isProgress == false} glow={currentStep == step} onClick={handleDone} text={btnText || "Done"} />
                        {/* {`${isProgress}`} */}
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
            console.log(data)
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

            const response = await axios.post(VIDEO_OVERLAY_API_URL + '/upload-video/', formData, {
                timeout: 10000000
            });
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
                timeout: 10000000
            });

            const url = `${VIDEO_OVERLAY_API_URL}/download-video/${response.data.file_name}`
            console.log(url, response.data)
            setOverlyedVideoUrl(url);
            

            // WebApp.downloadFile({
            //     url, file_name: "meme_to_post.mp4"
            // })

            setIsDownloaded(true)

            // const response1 = await axios.get(url, {
            //     responseType: 'blob',  // Важное изменение: ожидаем получение файла как Blob
            // });

            // const downloadUrl = URL.createObjectURL(response1.data);
            // const link = document.createElement('a');
            // link.href = downloadUrl;
            // link.download = `${fileId}_overlayed.mp4`;  // Задаём имя для скачиваемого файла
            // link.click();  // Имитируем клик по ссылке для начала скачивания

            // setIsDownloaded(true)
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

    const [overlyedVideoUrl, setOverlyedVideoUrl] = useState("");
    const WebApp = useWebApp();


    const [isModalVisible, setModalVisible] = useState(false);

    const handleDialogClose = () => {
      setModalVisible(false);
    };
  
    const handleDialogOpen = () => {
      setModalVisible(true);
    };
  
    const handleSendVideoURL = () => {
      // if (user) {
      handleDialogClose();
      // verify({ params: { telegramId: user.telegramId } });
      // }
    };
  

    return (
        // <ScrollArea style={{ maxHeight: "100vh" }}>
            <>
            {/* <GlowingButton onClick={() => WebApp.downloadFile({
                url: "https://video-api.egor-jan.tech/download-video/overlayed_c0852770-394b-4d0e-babf-89dabcda7933.mp4",
                file_name: "hi"
            })}>hey</GlowingButton> */}
                <WebappBackButton />
                <Flex asChild p="4" pt='3' pb="6" gap="6" direction="column">
                    <Box>
                        <Header />
               

                        <Step
                            text="1. Watch guide"
                            step={0}
                            currentStep={currentStep}
                            handleDone={() => setCurrentStep(1)}
                            btnText={"Begin earning"}
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
                            text="3. Select language & Download"
                            step={2}
                            currentStep={currentStep}
                            handleDone={async () => {
                                setLoading(true)
                                try {
                                    await WebApp.downloadFile({
                                        url: overlyedVideoUrl,
                                        file_name: `meme_to_post.mp4`,
                                    })
                                } catch (err) {
                                    const response1 = await axios.get(overlyedVideoUrl, {
                                        responseType: 'blob',  // Важное изменение: ожидаем получение файла как Blob
                                    });
    
                                    const downloadUrl = URL.createObjectURL(response1.data);
                                    const link = document.createElement('a');
                                    link.href = downloadUrl;
                                    link.download = `${fileId}_overlayed.mp4`;  // Задаём имя для скачиваемого файла
                                    link.click();  // Имитируем клик по ссылке для начала скачивания
                                }
                                setLoading(false)
                                
                                setCurrentStep(3)
                            }}
                            isProgress={overlyedVideoUrl.length > 1 && !loading}
                            btnText={loading ? 'Downloading...' : 'Download'}
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

                                    <AccentButton style={{ width: "100%", color: "#000" }} onClick={handleOverlayVideo} size="3" disabled={loading}>
                                        {loading ? 'Processing Video...' : 'Proceed Video'}
                                    </AccentButton>
                                </Flex>
                            </Card>
                            {/* {(overlyedVideoUrl.length > 0)  ? (
                                    <VideoCard videoSrc={overlyedVideoUrl} thumbnailSrc={overlyedVideoUrl} altText='Tutorial' />
                                ) : ("") } */}
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
                            handleDone={() => {}}
                            isProgress={false}
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
                        
                        <NftCard onClick={handleDialogOpen} glowing={false}>
                        <Box>
                            <Heading>Get Review</Heading>
                        </Box>
                        <ImgWrapper opacity={0.3}>
                            <img
                            src={`${process.env.PUBLIC_URL}/imgs/rocket.png`}
                            style={{
                                objectFit: 'cover',
                                height: '100%',
                            }}
                            />
                        </ImgWrapper>
                        <Box pt="1">
                            <Text color='gray'>
                            Meme reached 10K views, get Reward
                            </Text>
                        </Box>
                        </NftCard>             
      <Sheet
        isOpen={isModalVisible}
        onClose={() => handleDialogClose()}
        detent='content-height'
      >
        <Theme appearance='dark'>
          <Sheet.Container style={{ overflowY: 'auto', background: '#121113' }}>
            <Sheet.Header />
            <Sheet.Content>
              <Theme>
              <ScrollArea>
                <Grid gap='8' mb='5' p="4" align='center'>
                  <Flex justify='center'>
                    <CoinbagAnimated />
                  </Flex>
                  <Flex direction='column' gap='2'>
          <Card onClick={() => navigate(ROUTES.POST_MEME)}>
            <Flex gap='4' align='center' p='1'>
              <Box>
                <Text size='8' weight='bold'>
                  1
                </Text>
              </Box>
              <Box>
                <Box>Post Meme</Box>
                <Box>
                  <Text size='1' color='gray'>
                    follow the instructions 
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
                <Box>Your Meme gets {">"}10K views</Box>
                <Box>
                  <Text size='1' color='gray'>
                    You get 1 <Badge color='bronze'>XP-M2E</Badge> for each 1 view as reward
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
                  <Box>Send link to Moderation</Box>
                  <Box>
                    <Text size='1' color='gray'>
                      Wait unitl it gets as much views as possible, because you can send video on review only once
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
                  <GlowingButton
                    size='4'
                    onClick={() => {
                        WebApp.openLink('https://t.me/mf_sup_bot');
                    }}
                    style={{ width: '100%' }}
                  >
                    Get Reward
                  </GlowingButton>
                </Grid>

                </ScrollArea>
              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Theme>
      </Sheet>
                    </Box>
                </Flex>
            </>
        // </ScrollArea>
    );
}
