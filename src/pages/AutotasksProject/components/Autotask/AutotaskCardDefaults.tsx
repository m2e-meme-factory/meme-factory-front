import React, { FC, ReactNode, RefObject, useEffect, useRef, useState } from 'react';
import { Badge, Box, Flex, Heading, Text, TextField, Theme } from '@radix-ui/themes';
import { showErrorMessage, showSuccessMessage } from '@shared/utils/helpers/notify';
import { Sheet } from 'react-modal-sheet';
import { CaretRightIcon, CheckIcon } from '@radix-ui/react-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useTranslation } from 'react-i18next';

import ConnectWallet from '../../../WalletPage/ConnectWallet';
import CopyableRef from '../CopyableField/CopyableRef';

import { getIconByTaskСategory } from '@shared/utils/helpers/getIconByTaskCategory';
import { getAutotaskDefautsApplications } from '@shared/utils/api/requests/autotask/getAutotaskDefautsApplications';
import { applyForAutotaskDefaultsCompletion } from '@shared/utils/api/requests/autotask/applyForAutotaskDefaultsCompletion';
import { claimAutotaskDefaultsReward } from '@shared/utils/api/requests/autotask/claimAutotaskDefaultsReward';
import { formatNumberWithSpaces } from '@shared/utils/helpers/formatNumbers';
import { isMobileDevice } from '@shared/utils/helpers/is-mobile-device';
import { AccentButton } from '@shared/components/Buttons/GlowingButton';
import { LOCAL_TEXT } from '@shared/consts';

import styles from '@shared/components/SocialsLink/SocialsLink.module.css';
import '@styles/CustomSheetsStyles.css';

type AutotaskCateory =
  | 'wallet'
  | 'checkin'
  | 'welcome-bonus'
  | 'shere-in-stories'
  | 'account-bio'
  | 'web-url'
  | 'open-x'
  | 'open-tg'
  | 'open-youtube'
  | 'open-tiktok'
  | 'open-reddit'
  | 'open-discord'
  | 'open-pitchdek'
  | 'open-whitepaper';

interface AutotaskProps {
  title: string;
  description: string;
  price: string;
  children?: ReactNode;
  userId: number;
  claimed: boolean;
  applied: boolean;
  refLink?: string;
  markTaskCompleted: (c: AutotaskCateory) => void;
  category: AutotaskCateory;
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
    case 'wallet':
      return isClaimed ? (
        ''
      ) : (
        <ConnectWallet onSuccess={() => (otherProps?.onClick ? otherProps?.onClick() : null)} />
      );
    case 'checkin':
      return isClaimed ? (
        t(LOCAL_TEXT.COME_BACK_TOMORROW)
      ) : (
        <AccentButton onClick={otherProps?.onClick} size='4'>
          {t(LOCAL_TEXT.CLAIM_ONE_DAY)}
        </AccentButton>
      );
    case 'web-url':
      return isClaimed ? (
        ''
      ) : (
        <AccentButton onClick={otherProps?.onClick} size='4'>
          {t(LOCAL_TEXT.OPEN)}
        </AccentButton>
      );
    case 'welcome-bonus':
      return isClaimed ? (
        t(LOCAL_TEXT.THANKS_FOR_JOINING)
      ) : (
        <AccentButton onClick={otherProps?.onClick} size='4'>
          {t(LOCAL_TEXT.CLAIM)}
        </AccentButton>
      );
    case 'shere-in-stories':
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
    case 'account-bio':
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

// const AutotaskCardDefaults = () => {
const AutotaskCardDefaults: FC<AutotaskProps> = ({
  title,
  description,
  price,
  children,
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

  const { data: application, refetch: refetchApplication } = useQuery({
    queryFn: () =>
      getAutotaskDefautsApplications({ params: { userId: userId, taskCategory: category } }),
    queryKey: ['autotaskApplication', userId, category],
    enabled: applied,
    select: (data) => data.data[0],
  });

  useEffect(() => {
    if (application) {
      const status: ApplicationStatus = application.isConfirmed
        ? LOCAL_TEXT.CLIMED
        : LOCAL_TEXT.APPLIED;
      setApplicationStatus(status);
    }
  }, [application]);

  const [submitting, setSubmitting] = useState(false);

  //Apply for autotask
  const { mutate: apply } = useMutation({
    mutationFn: applyForAutotaskDefaultsCompletion,
    onError: () => {
      showErrorMessage(t(LOCAL_TEXT.ERROR_WHILE_OCCURRED_APPLYING_AUTOTASK_COMPLETION));
      setSubmitting(false);
    },
    onSuccess: () => {
      showSuccessMessage(t(LOCAL_TEXT.SUCCESSFULLY_CLAIMED));
      markTaskCompleted(category);
    },
  });

  //Claim reward
  const { mutate: claim, isPending: isClaiming } = useMutation({
    mutationFn: claimAutotaskDefaultsReward,
    onError: (error: AxiosError) => {
      const response = error.response?.data as {
        error: string;
        message: string;
        statusCode: number;
      };
      if (response) {
        showErrorMessage(response.message || t(LOCAL_TEXT.AN_UNKNOWN_ERROR_OCCURRED));
      } else {
        showErrorMessage(t(LOCAL_TEXT.AN_UNKNOWN_ERROR_OCCURRED));
      }
    },
    onSuccess: () => {
      setIsClaimed(true);
      showSuccessMessage(t(LOCAL_TEXT.REWARD_CLAIMED_SUCCESSFULLY));
    },
    onSettled: () => {
      refetchApplication();
    },
  });

  const handleApplyClick = () => {
    if (applicationStatus === LOCAL_TEXT.UNSTARTED && !submitting) {
      setSubmitting(true);
      apply({ params: { amount: price } });
    }
  };

  const handleClaimClick = () => {
    if (isClaiming && applicationStatus === LOCAL_TEXT.APPLIED) return;

    claim({ params: { taskCategory: category } });
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
            <Text weight='regular' size='3' color='gray'>
              +{formatNumberWithSpaces(price)}{' '}
              <Badge color='gold' radius='full'>
                XP
              </Badge>
            </Text>
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
                    <Text align='center' color='gray'>
                      <i>
                        +{formatNumberWithSpaces(price)} <Badge color='bronze'>XP</Badge>
                      </i>
                    </Text>
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
                      onClick: handleApplyClick,
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
