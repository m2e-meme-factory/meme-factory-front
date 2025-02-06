import React, { FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { Badge, Box, Flex, Heading, Skeleton, Text, TextField, Theme } from '@radix-ui/themes';
import { Sheet } from 'react-modal-sheet';
import { CaretRightIcon, CheckIcon } from '@radix-ui/react-icons';
import { useTranslation } from 'react-i18next';

import ConnectWallet from '../../../WalletPage/ConnectWallet';
import CopyableRef from '../CopyableField/CopyableRef';

import { AccentButton } from '@shared/components/Buttons/GlowingButton';

import { getIconByTaskСategory } from '@shared/utils/helpers/getIconByTaskCategory';
import { formatNumberWithSpaces } from '@shared/utils/helpers/formatNumbers';
import { isMobileDevice } from '@shared/utils/helpers/is-mobile-device';

import { LOCAL_TEXT } from '@shared/consts';
import { CATEGORY_TASKS } from '@shared/consts/category-tasks';

import styles from '@shared/components/SocialsLink/SocialsLink.module.css';
import '@styles/CustomSheetsStyles.css';

type AutotaskCateory =
  | typeof CATEGORY_TASKS.WALLET
  | typeof CATEGORY_TASKS.CHECKIN
  | typeof CATEGORY_TASKS.WELCOME_BONUS
  | typeof CATEGORY_TASKS.SHARE_IN_STORIES
  | typeof CATEGORY_TASKS.ACCOUNT_BIO
  | typeof CATEGORY_TASKS.WEB_URL
  | typeof CATEGORY_TASKS.OPEN_X
  | typeof CATEGORY_TASKS.OPEN_TG
  | typeof CATEGORY_TASKS.OPEN_YOUTUBE
  | typeof CATEGORY_TASKS.OPEN_TIKTOK
  | typeof CATEGORY_TASKS.OPEN_REDDIT
  | typeof CATEGORY_TASKS.OPEN_DISCORD
  | typeof CATEGORY_TASKS.OPEN_PITCHDEK
  | typeof CATEGORY_TASKS.OPEN_WHITEPAPER;

interface AutotaskProps {
  title: string;
  description: string;
  price: number;
  children?: ReactNode;
  userId: number;
  claimed: boolean;
  applied: boolean;
  refLink?: string;
  markTaskCompleted: (c: AutotaskCateory) => void;
  category: AutotaskCateory;
  isLoading: boolean;
  walletAddress?: string;
  webUrl?: string;
}

const getCardContent = (
  category: string,
  isClaimed: boolean = false,
  t: (key: string) => string,
  inputRef: RefObject<HTMLInputElement>,
  otherProps?: {
    onClick?: () => void;
    handleBlur?: () => void;
    handleFocus?: () => void;
    setTextValue?: (v: string) => void;
    refLink?: string;
  }
) => {
  switch (category) {
    case CATEGORY_TASKS.WALLET:
      return isClaimed ? (
        ''
      ) : (
        <ConnectWallet onSuccess={() => (otherProps?.onClick ? otherProps?.onClick() : null)} />
      );
    case CATEGORY_TASKS.CHECKIN:
      return isClaimed ? (
        t(LOCAL_TEXT.COME_BACK_TOMORROW)
      ) : (
        <AccentButton onClick={otherProps?.onClick} size='4'>
          {t(LOCAL_TEXT.CLAIM_ONE_DAY)}
        </AccentButton>
      );
    case CATEGORY_TASKS.WEB_URL:
      return isClaimed ? (
        ''
      ) : (
        <AccentButton onClick={otherProps?.onClick} size='4'>
          {t(LOCAL_TEXT.OPEN)}
        </AccentButton>
      );
    case CATEGORY_TASKS.WELCOME_BONUS:
      return isClaimed ? (
        t(LOCAL_TEXT.THANKS_FOR_JOINING)
      ) : (
        <AccentButton onClick={otherProps?.onClick} size='4'>
          {t(LOCAL_TEXT.CLAIM)}
        </AccentButton>
      );
    case CATEGORY_TASKS.SHARE_IN_STORIES:
      return isClaimed ? (
        t(LOCAL_TEXT.THANKS_FOR_JOINING)
      ) : (
        <Flex direction='column' gap='2'>
          <Flex justify='between' align='center'>
            <Text>{t(LOCAL_TEXT.SHARE_STORY_YOUR_INSTAGRAM_ACCOUNT_INVITE_LINK)}</Text>
            <CopyableRef refLink={otherProps?.refLink || 'https://t.me/autotasks_bot'} />
          </Flex>
          <TextField.Root
            ref={inputRef}
            size='3'
            mt='2'
            placeholder='Instagram url'
            onChange={(e) => {
              if (otherProps?.setTextValue) {
                otherProps.setTextValue(e.currentTarget.value.toString());
              }
            }}
            onBlur={otherProps?.handleBlur}
            onFocus={otherProps?.handleFocus}
          />
          <AccentButton onClick={otherProps?.onClick} size='4'>
            {t(LOCAL_TEXT.CLAIM)}
          </AccentButton>
        </Flex>
      );
    case CATEGORY_TASKS.ACCOUNT_BIO:
      return isClaimed ? (
        t(LOCAL_TEXT.THANKS_FOR_JOINING)
      ) : (
        <Flex direction='column' gap='2'>
          <Flex justify='between' align='center'>
            <Text>{t(LOCAL_TEXT.PUT_YOUR_INVITE_LINK_INSTAGRAM_ACCOUNT_BIO)}</Text>
            <CopyableRef refLink='https://t.me/autotasks_bot' />
          </Flex>
          <TextField.Root size='3' mt='2' placeholder='Instagram url' />
          <AccentButton onClick={otherProps?.onClick} size='4'>
            {t(LOCAL_TEXT.CLAIM)}
          </AccentButton>
        </Flex>
      );
    default:
      return isClaimed ? (
        ''
      ) : (
        <AccentButton onClick={otherProps?.onClick} size='4'>
          {t(LOCAL_TEXT.OPEN)}
        </AccentButton>
      );
  }
};

const AutotaskCardDefaults: FC<AutotaskProps> = ({
  title,
  description,
  isLoading,
  price,
  userId,
  applied,
  claimed,
  category,
  refLink,
  markTaskCompleted,
  webUrl,
}) => {
  const { t, i18n } = useTranslation();
  //   //State of autotask
  type ApplicationStatus = LOCAL_TEXT.APPLIED | LOCAL_TEXT.CLIMED | LOCAL_TEXT.UNSTARTED;
  const [isApplied, setIsApplied] = useState(applied);
  const [isClaimed, setIsClaimed] = useState(claimed);
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus>(
    isApplied ? (isClaimed ? LOCAL_TEXT.CLIMED : LOCAL_TEXT.APPLIED) : LOCAL_TEXT.UNSTARTED
  );

  const [isIPhone, setIsIPhone] = useState(false);
  const isRu = i18n.language === 'ru';
  const isMobile = isMobileDevice();

  const inputRef = useRef<HTMLInputElement>(null);

  const handleFocus = () => {
    const isIPhone = (): boolean => {
      const userAgent = window.navigator.userAgent;
      return /iPhone/.test(userAgent);
    };

    if (inputRef.current) {
      setIsIPhone(isIPhone());
    }
  };

  const handleBlur = () => {
    if (inputRef.current) {
      setIsIPhone(false);
    }
  };

  useEffect(() => {
    setApplicationStatus(
      isApplied ? (isClaimed ? LOCAL_TEXT.CLIMED : LOCAL_TEXT.APPLIED) : LOCAL_TEXT.UNSTARTED
    );
  }, [isApplied, isClaimed]);

  useEffect(() => {
    setIsClaimed(claimed);
  }, [claimed]);

  useEffect(() => {
    setIsApplied(applied);
  }, [applied]);

  //   //Card styles
  type CardStyles = Record<LOCAL_TEXT.APPLIED | LOCAL_TEXT.CLIMED | LOCAL_TEXT.UNSTARTED, string>;
  const cardStyles: CardStyles = {
    applied: 'none',
    claimed: 'none',
    unstarted: '1px solid #1C1C1E',
  };

  const [cardStyle, setCardStyle] = useState<React.CSSProperties>({
    border: cardStyles[applicationStatus as ApplicationStatus],
    borderRadius: '12px',
    padding: '8px',
    backgroundColor: '#0B0B0B',
    cursor: 'pointer',
  });

  useEffect(() => {
    setCardStyle({
      border: cardStyles[applicationStatus as ApplicationStatus],
      borderRadius: '12px',
      padding: '8px',
      cursor: 'pointer',
    });
  }, [applicationStatus]);

  //Modal controls
  const [isModalVisible, setModalVisible] = useState(false);

  const handleDialogClose = () => {
    setModalVisible(false);
  };

  const handleDialogOpen = () => {
    if (!claimed) setModalVisible(true);
  };

  const handleClaimClick = (category: string) => {
    markTaskCompleted(category);
  };

  return (
    <Box className='SubtaskCard' style={cardStyle} onClick={handleDialogOpen}>
      <Flex align='center' justify='between' pl='2' pr='2'>
        <Flex align={'center'}>
          <Box
            style={{
              backgroundColor: '#181818',
              borderRadius: '8px',
              padding: '6px',
              width: '36px',
              height: '36px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#A8A8A8',
            }}
          >
            {getIconByTaskСategory(category)}
          </Box>

          <Flex direction='column' ml='4'>
            <Text
              size='4'
              weight='bold'
              style={{
                userSelect: 'text',
                textTransform: 'uppercase',
                overflowWrap: 'break-word',
                wordBreak: 'normal',
              }}
            >
              {title}
            </Text>
            <Skeleton loading={!isLoading}>
              <Text weight='regular' size='3' color='gray'>
                +{formatNumberWithSpaces(price)}{' '}
                <Badge color='gold' radius='full'>
                  XP
                </Badge>
              </Text>
            </Skeleton>
          </Flex>
        </Flex>

        {isClaimed ? (
          <CheckIcon color='#45a951' width={20} height={20} />
        ) : (
          <CaretRightIcon width={24} height={24} color='#A8A8A8' />
        )}

        <Sheet
          isOpen={isModalVisible}
          onClose={() => handleDialogClose()}
          detent='content-height'
          style={{ zIndex: 2 }}
        >
          <Sheet.Container
            style={{
              background:
                'radial-gradient(circle at 50% -21%, #716946, rgb(28, 28, 30), rgb(30, 28, 30))',
            }}
          >
            <Sheet.Header />
            <Sheet.Content>
              <Theme style={{ width: '100%' }}>
                <Flex m='4' gap='2' direction='column'>
                  <Flex justify='center'>
                    <img width={'40%'} src={`${process.env.PUBLIC_URL}/imgs/hands_v2.png`} alt='' />
                  </Flex>
                  <Flex mb='5' mt='4' direction={'column'} gap='2'>
                    <Heading
                      align='center'
                      style={
                        isRu && isMobile
                          ? {
                              userSelect: 'text',
                              overflowWrap: 'break-word',
                              wordBreak: 'normal',
                              fontSize: '22px',
                            }
                          : {
                              userSelect: 'text',
                              overflowWrap: 'break-word',
                              wordBreak: 'normal',
                            }
                      }
                    >
                      {title}
                    </Heading>
                    <Skeleton loading={!isLoading}>
                      <Text align='center' color='gray'>
                        <i>
                          +{formatNumberWithSpaces(price)} <Badge color='bronze'>XP</Badge>
                        </i>
                      </Text>
                    </Skeleton>
                    <Flex justify='center'>
                      <Badge
                        size='3'
                        color={isApplied ? (isClaimed ? 'green' : 'yellow') : 'gray'}
                        variant='soft'
                      >
                        {t(applicationStatus)}
                      </Badge>
                    </Flex>
                  </Flex>
                  <Flex direction='column' gap='2' mb={isIPhone ? '100%' : 'unset'}>
                    {getCardContent(category, claimed, t, inputRef, {
                      onClick: () => handleClaimClick(category),
                      handleBlur: handleBlur,
                      handleFocus: handleFocus,
                      refLink: refLink,
                    })}
                    <p className={styles.warning}>{description}</p>
                  </Flex>
                </Flex>
              </Theme>
            </Sheet.Content>
          </Sheet.Container>
          <Sheet.Backdrop onTap={() => handleDialogClose()} />
        </Sheet>
      </Flex>
    </Box>
  );
};

export default AutotaskCardDefaults;
