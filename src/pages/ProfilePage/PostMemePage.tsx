import { PropsWithChildren, useState } from 'react';
import {
  ScrollArea,
  Flex,
  Box,
  Heading,
  Card,
  Button,
  TextField,
  Text,
  Callout,
  Tabs,
  Select,
  Badge,
  Grid,
  Theme,
  ThickCheckIcon,
} from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import { useNavigate } from 'react-router-dom';
import { InfoCircleOutlined } from '@ant-design/icons';
import axios from 'axios';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';

import FileUpload from './FileUpload';

import { Header } from '@widgets/header';

import GlowingButton from '@shared/components/Buttons/GlowingButton';
import WebappBackButton from '@shared/components/WebappBackButton';
import { showSuccessMessage } from '@shared/utils/helpers/notify';
import CoinbagAnimated from '@shared/components/LottieIcons/Coinbag/CoinbagAnimated';
import { SolidCard } from '@shared/components/Card/SolidCard';
import YellowBorderButton from '@shared/components/Buttons/YellowBorderButton';
import VideoCard from '@shared/components/VideoCard';
import { LOCAL_TEXT, ROUTES } from '@shared/consts';

import styled from 'styled-components';
import { COLOR_CONSTANT } from '@styles/color-constant';
import { useMixpanelContext } from '@providers/provider-mixpanel';
import { MIXPANEL_EVENT } from '@shared/consts/mixpanel-event';

const VIDEO_OVERLAY_API_URL = 'https://video-api.egor-jan.tech';

const ChangableButton = ({
  text,
  glow,
  onClick,
  disabled,
}: {
  text: string;
  glow?: boolean;
  disabled?: boolean;
  onClick: () => void;
}) => {
  if (glow)
    return (
      <GlowingButton disabled={disabled} size='4' onClick={onClick} style={{ flex: '1' }}>
        {text}
      </GlowingButton>
    );

  return <></>;
};

const NftCard = styled(SolidCard)<{ glowing: boolean }>`
  min-height: 15vh;
  /* display: flex; */
  /* flex-direction: column; */
  /* justify-content: space-between; */
  transition: ease 0.2s;

  &:active {
    cursor: pointer;
    transform: scale(0.8);
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

const Step = ({
  children,
  text,
  step,
  currentStep,
  handleDone,
  handleReset,
  isProgress,
  btnText,
}: PropsWithChildren<{
  text: string;
  step: number;
  currentStep: number;
  handleDone: () => void;
  handleReset?: () => void;
  isProgress?: boolean;
  btnText?: string;
}>) => {
  const { t } = useTranslation();
  return (
    <>
      <Box
        style={{
          padding: '12px',
          borderRadius: '10px',
          border: '1px solid #1c1c1e',
          backgroundColor: currentStep === step ? '#202020' : '',
        }}
      >
        <Flex direction='column' gap='4'>
          <Heading
            weight='regular'
            size='3'
            style={{ color: currentStep === step ? '#fff' : 'var(--gray-10)' }}
          >
            {text}
          </Heading>
          {currentStep >= step && (
            <>
              {children}
              <Flex gap={'2'}>
                <ChangableButton
                  disabled={isProgress === false}
                  glow={currentStep === step}
                  onClick={handleDone}
                  text={btnText || t(LOCAL_TEXT.NEXT).toUpperCase()}
                />
                {handleReset &&
                  (isProgress === true || currentStep > 2) &&
                  currentStep === step && (
                    <YellowBorderButton
                      onClick={handleReset}
                      size='3'
                      style={{
                        flex: '1',
                        height: '48px',
                        fontSize: '15px',
                        textTransform: 'uppercase',
                      }}
                    >
                      {t(LOCAL_TEXT.RESET).toUpperCase()}
                    </YellowBorderButton>
                  )}
              </Flex>
            </>
          )}
        </Flex>
      </Box>
    </>
  );
};

export default function PostMemePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitedVideo, setIsSubmitedVideo] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('EN');
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [overlyedVideoUrl, setOverlyedVideoUrl] = useState('');
  const { trackEvent } = useMixpanelContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleButtonReset = () => {
    setCurrentStep(0);
    setIsSubmitedVideo(false);
    setVideoUrl('');
    setFile(null);
    setFileName(null);
    setSelectedLanguage('EN');
    setIsDownloaded(false);
    setOverlyedVideoUrl('');
  };

  const handleUploadVideoUrl = async () => {
    if (!videoUrl) {
      setError(t(LOCAL_TEXT.PLEASE_ENTER_URL_VIDEO));
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
        setFileName(data.file_name); // Сохраняем file_id
        setIsSubmitedVideo(true); // Делаем видео отправленным
        setCurrentStep(2);
      }
    } catch (err) {
      setError(t(LOCAL_TEXT.ERROR_LOADING_VIDEO));
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
      setError(t(LOCAL_TEXT.PLEASE_SELECT_FILE));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(VIDEO_OVERLAY_API_URL + '/upload-video/', formData, {
        timeout: 10000000,
      });
      const data = response.data;
      if (data.error) {
        setError(data.error);
      } else {
        setFileName(data.file_name); // Сохраняем file_id
        setIsSubmitedVideo(true); // Делаем видео отправленным
      }
    } catch (err) {
      setError(t(LOCAL_TEXT.ERROR_LOADING_FILE));
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayVideo = async () => {
    if (!fileName) {
      setError(t(LOCAL_TEXT.NOT_FOUND_FILE_ID));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const data = {
        file_name: fileName,
        language: selectedLanguage,
        overlay_type: 'ffmpeg',
      };

      const response = await axios.post(`${VIDEO_OVERLAY_API_URL}/overlay-video/`, data, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        timeout: 10000000,
      });

      const url = `${VIDEO_OVERLAY_API_URL}/download-video/${response.data.file_name}`;

      setOverlyedVideoUrl(url);

      setIsDownloaded(true);
      trackEvent(MIXPANEL_EVENT.VIDEO_UPLOADED);
    } catch (err) {
      setError(t(LOCAL_TEXT.ERROR_PROCESSING_VIDEO));
    } finally {
      setLoading(false);
    }
  };

  const [copyText, setCopyText] = useState(LOCAL_TEXT.COPY);

  const handleCopyText = (text: string) => {
    const textToCopy = text;

    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          showSuccessMessage(t(LOCAL_TEXT.COPIED));
          setCopyText(LOCAL_TEXT.COPIED);

          setTimeout(() => {
            setCopyText(LOCAL_TEXT.COPY);
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
      showSuccessMessage(t(LOCAL_TEXT.COPIED));
      setCopyText(LOCAL_TEXT.COPIED);

      setTimeout(() => {
        setCopyText(LOCAL_TEXT.COPY);
      }, 5000);
    } catch (error) {
      console.error('Fallback copy failed.', error);
    }

    document.body.removeChild(tempInput);
  };

  const WebApp = useWebApp();

  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    setModalVisible(true);
  };

  return (
    <>
      <WebappBackButton />
      <Flex asChild p='4' pt='3' pb='6' gap='3' direction='column'>
        <Box>
          <Header />

          <Step
            text={`1. ${t(LOCAL_TEXT.WATCH_GUIDE)}`}
            step={0}
            currentStep={currentStep}
            handleDone={() => setCurrentStep(1)}
            btnText={t(LOCAL_TEXT.DONE).toUpperCase()}
          >
            <VideoCard
              videoSrc={process.env.PUBLIC_URL + '/video/about.mp4'}
              thumbnailSrc={process.env.PUBLIC_URL + '/imgs/thumbnail.png'}
              altText='Tutorial'
            />
          </Step>
          <Step
            text={`2. ${t(LOCAL_TEXT.UPLOAD_VIDEO)}`}
            step={1}
            currentStep={currentStep}
            handleDone={() => setCurrentStep(2)}
            handleReset={handleButtonReset}
            isProgress={isSubmitedVideo}
          >
            {!isSubmitedVideo ? (
              <Tabs.Root defaultValue='web'>
                <Tabs.List>
                  <Tabs.Trigger style={{ fontSize: '16px' }} value='web'>
                    {t(LOCAL_TEXT.FROM_LINK)}
                  </Tabs.Trigger>
                  <Tabs.Trigger style={{ fontSize: '16px' }} value='local'>
                    {t(LOCAL_TEXT.UPLOAD_LOCAL)}
                  </Tabs.Trigger>
                </Tabs.List>

                <Box pt='3'>
                  <Tabs.Content value='web'>
                    <Flex direction='column' gap='2'>
                      <Text size={'3'}>{t(LOCAL_TEXT.ENTER_LINK_VIDEO)}</Text>
                      <Text size={'1'} style={{ color: `${COLOR_CONSTANT.PS}` }}>
                        {t(LOCAL_TEXT.SERVICE_NOT_WORK_STABLY)}
                      </Text>
                      <TextField.Root
                        size='3'
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        placeholder={t(LOCAL_TEXT.PASTE_MEME_URL)}
                      />
                      <YellowBorderButton
                        onClick={handleUploadVideoUrl}
                        size='4'
                        style={{ fontSize: '15px' }}
                        disabled={loading}
                      >
                        {t(LOCAL_TEXT.PROCEED_VIDEO)}
                      </YellowBorderButton>
                    </Flex>
                  </Tabs.Content>

                  <Tabs.Content value='local'>
                    <Flex direction='column' gap='2'>
                      <FileUpload onChange={handleFileChange} />
                      {file != null && (
                        <Button
                          color='amber'
                          onClick={handleUploadVideoFile}
                          size='3'
                          disabled={loading}
                        >
                          {t(LOCAL_TEXT.UPLOAD)}
                        </Button>
                      )}
                    </Flex>
                  </Tabs.Content>
                </Box>
              </Tabs.Root>
            ) : (
              <Flex direction='column' gap='2'>
                <Callout.Root>
                  <Callout.Text style={{ color: 'white' }}>{fileName}</Callout.Text>
                </Callout.Root>

                <Callout.Root
                  color='green'
                  variant='outline'
                  style={{ padding: '0', border: '0', boxShadow: 'none' }}
                >
                  <Callout.Icon>
                    <ThickCheckIcon />
                  </Callout.Icon>
                  <Callout.Text>{t(LOCAL_TEXT.VIDEO_WAS_UPLOADED)}</Callout.Text>
                </Callout.Root>
              </Flex>
            )}
          </Step>
          <Step
            text={`3. ${t(LOCAL_TEXT.SELECT_LANGUAGE_DOWNLOAD)}`}
            step={2}
            currentStep={currentStep}
            handleDone={async () => {
              setLoading(true);
              try {
                await WebApp.downloadFile({
                  url: overlyedVideoUrl,
                  file_name: `meme_to_post.mp4`,
                });
              } catch (err) {
                const response1 = await axios.get(overlyedVideoUrl, {
                  responseType: 'blob', // Важное изменение: ожидаем получение файла как Blob
                });

                const downloadUrl = URL.createObjectURL(response1.data);
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.download = `${fileName}_overlayed.mp4`; // Задаём имя для скачиваемого файла
                link.click(); // Имитируем клик по ссылке для начала скачивания
              }
              trackEvent(MIXPANEL_EVENT.VIDEO_DOWNLOADED);
              setLoading(false);

              setCurrentStep(3);
            }}
            handleReset={handleButtonReset}
            isProgress={overlyedVideoUrl.length > 1 && !loading}
            btnText={t(LOCAL_TEXT.DOWNLOAD)}
          >
            <Flex direction='column' gap='4'>
              <Text>{t(LOCAL_TEXT.SELECT_LANGUAGE)}</Text>

              <Select.Root defaultValue='EN' onValueChange={setSelectedLanguage}>
                <Select.Trigger />
                <Select.Content>
                  <Select.Item value='EN'>{t(LOCAL_TEXT.ENGLISH)}</Select.Item>
                  {/* <Select.Item value='RU'>{t(LOCAL_TEXT.RUSSIAN)}</Select.Item> */}
                </Select.Content>
              </Select.Root>
              <YellowBorderButton
                onClick={handleOverlayVideo}
                size='3'
                style={{ fontSize: '15px', textTransform: 'uppercase' }}
                disabled={loading || isDownloaded}
              >
                {loading ? t(LOCAL_TEXT.PROCESSING_VIDEO) : t(LOCAL_TEXT.PROCEED_VIDEO)}
              </YellowBorderButton>
            </Flex>
          </Step>
          <Step
            text={`4. ${t(LOCAL_TEXT.UPLOAD_TO_INSTAGRAM)}`}
            step={3}
            currentStep={currentStep}
            handleDone={() => setCurrentStep(4)}
            handleReset={handleButtonReset}
          >
            {fileName && !loading && (
              <Flex direction='column' gap='4'>
                <Text>{t(LOCAL_TEXT.COPY_DESCRIPTION_UPLOAD_VIDEO_YOUR_INSTAGRAM_ACCOUNT)}</Text>
                <Callout.Root color='gray'>
                  {t(LOCAL_TEXT.JOIN_MEME_TOEARN_LINK_IN_ACCOUNT_BIO)}
                </Callout.Root>
                <Button
                  onClick={() => handleCopyText(t(LOCAL_TEXT.JOIN_MEME_TOEARN_LINK_IN_ACCOUNT_BIO))}
                  color='gray'
                  size='3'
                >
                  {t(copyText)}
                </Button>
              </Flex>
            )}
          </Step>
          <Step
            text={`5. ${t(LOCAL_TEXT.COMPLETE_WAIT)}`}
            step={4}
            currentStep={currentStep}
            handleDone={() => {
              navigate(ROUTES.PROFILE);
            }}
            handleReset={handleButtonReset}
            isProgress={true}
          >
            <Flex direction='column' gap='4'>
              <Callout.Root color='gray'>
                {t(LOCAL_TEXT.NOW_JUST_WAIT_UNTIL_YOUR_MEME_REACH_VIEWS_AND)}{' '}
                <b>{t(LOCAL_TEXT.SEND_VIDEO_ON_REVIEW)}</b>
              </Callout.Root>

              <Callout.Root color='red'>
                <Callout.Icon>
                  <InfoCircleOutlined />
                </Callout.Icon>
                <Callout.Text>
                  {t(
                    LOCAL_TEXT.WAIT_UNTIL_GETS_MANY_VIEWS_POSSIBLE_BECAUSE_YOU_CAN_SEND_VIDEO_ONLY
                  )}
                </Callout.Text>
              </Callout.Root>
            </Flex>
          </Step>

          <NftCard
            onClick={handleDialogOpen}
            glowing={false}
            style={{
              background: '#1c1c1e url(imgs/earn.svg) no-repeat top right',
              minHeight: '14vh',
            }}
          >
            <Box style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <Flex direction='row' gap='4'>
                <img
                  src={`${process.env.PUBLIC_URL}/imgs/review.svg`}
                  style={{
                    width: '36px',
                    height: '36px',
                  }}
                  alt=''
                />

                <Flex direction='column' mb={'1'}>
                  <Heading size='3' weight='regular' style={{ lineHeight: '1.1' }}>
                    {t(LOCAL_TEXT.GET_REVIEW)}
                  </Heading>
                  <Box>
                    <Text color='gray' weight='regular' style={{ fontSize: '12px' }}>
                      {t(LOCAL_TEXT.MEME_REACHED_VIEWS_GET_REWARD)}
                    </Text>
                  </Box>
                </Flex>
              </Flex>
              <YellowBorderButton
                size='4'
                style={{
                  display: 'flex',
                  marginTop: 'auto',
                  height: '32px',
                  textTransform: 'uppercase',
                }}
              >
                {t(LOCAL_TEXT.GET)}
              </YellowBorderButton>
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
                      <Grid gap='8' mb='5' p='4' pl='2' pr='2' align='center'>
                        <Flex justify='center'>
                          <CoinbagAnimated />
                        </Flex>
                        <Flex direction='column' gap='3'>
                          <Card onClick={() => navigate(ROUTES.POST_MEME)}>
                            <Flex gap='4' align='center'>
                              <Box
                                style={{
                                  backgroundColor: '#2b2b2b',
                                  borderRadius: '8px',
                                  padding: '6px',
                                  width: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text
                                  size='4'
                                  weight='regular'
                                  style={{
                                    fontFamily: 'ME',
                                    display: 'flex',
                                    minWidth: '36px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  1
                                </Text>
                              </Box>
                              <Box>
                                <Heading size='1' weight='regular' style={{ lineHeight: '1.2' }}>
                                  {t(LOCAL_TEXT.POST_MEME)}
                                </Heading>
                                <Box>
                                  <Text size='1' color='gray'>
                                    {t(LOCAL_TEXT.FOLLOW_INSTRUCTIONS)}
                                  </Text>
                                </Box>
                              </Box>
                            </Flex>
                          </Card>

                          <Card>
                            <Flex gap='4' align='center'>
                              <Box
                                style={{
                                  backgroundColor: '#2b2b2b',
                                  borderRadius: '8px',
                                  padding: '6px',
                                  width: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text
                                  size='4'
                                  weight='regular'
                                  style={{
                                    fontFamily: 'ME',
                                    display: 'flex',
                                    minWidth: '36px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  2
                                </Text>
                              </Box>
                              <Box>
                                <Heading size='1' weight='regular' style={{ lineHeight: '1.2' }}>
                                  {t(LOCAL_TEXT.YOUR_MEME_GETS_VIEWS)}
                                </Heading>
                                <Box>
                                  <Text size='1' color='gray'>
                                    {t(LOCAL_TEXT.YOU_GET)} 1 <Badge color='bronze'>XP</Badge>{' '}
                                    {t(LOCAL_TEXT.FOR_EACH_VIEW_AS_REWARD)}
                                  </Text>
                                </Box>
                              </Box>
                            </Flex>
                          </Card>

                          <Card>
                            <Flex gap='4' align='center'>
                              <Box
                                style={{
                                  backgroundColor: '#2b2b2b',
                                  borderRadius: '8px',
                                  padding: '6px',
                                  width: '36px',
                                  height: '36px',
                                  display: 'flex',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Text
                                  size='4'
                                  weight='regular'
                                  style={{
                                    fontFamily: 'ME',
                                    display: 'flex',
                                    minWidth: '36px',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                  }}
                                >
                                  3
                                </Text>
                              </Box>
                              <Flex justify='between' width='100%' align='center'>
                                <Box>
                                  <Heading size='1' weight='regular' style={{ lineHeight: '1.2' }}>
                                    {t(LOCAL_TEXT.SEND_LINK_MODERATION)}
                                  </Heading>
                                  <Box style={{ lineHeight: '1.1' }}>
                                    <Text size='1' color='gray'>
                                      {t(
                                        LOCAL_TEXT.WAIT_UNTIL_GETS_MANY_VIEWS_POSSIBLE_BECAUSE_YOU_CAN_SEND_VIDEO_ONLY
                                      )}
                                    </Text>
                                  </Box>
                                </Box>
                              </Flex>
                            </Flex>
                          </Card>
                        </Flex>
                        <GlowingButton
                          size='4'
                          onClick={() => {
                            WebApp.openLink('https://t.me/mf_sup_bot');
                          }}
                          style={{ width: '100%', textTransform: 'uppercase' }}
                        >
                          {t(LOCAL_TEXT.GET_REWARD)}
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
  );
}
