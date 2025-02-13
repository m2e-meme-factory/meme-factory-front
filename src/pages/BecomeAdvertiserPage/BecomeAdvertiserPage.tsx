import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Heading, TextArea, Text, Button, Box } from '@radix-ui/themes';

import { useTranslation } from 'react-i18next';

import { showSuccessMessage } from '@shared/utils/helpers/notify';
import { LOCAL_TEXT } from '@shared/consts';

const BecomeAdvertiserPage = () => {
  const { t } = useTranslation();
  const [textareaInput, setTextareaInput] = React.useState('');
  const navigate = useNavigate();

  return (
    <Box m='4'>
      <Flex direction='column' justify='start' align='start' gap='2'>
        <Heading>
          {t(LOCAL_TEXT.BECOME)} <span style={{ color: '#fecf0a' }}>{t(LOCAL_TEXT.PARTNER)}</span>
        </Heading>
        <Text>{t(LOCAL_TEXT.PROVIDE_SOME_INFORMATION_ABOUT_YOUR_PROJECT)}</Text>
        <TextArea
          value={textareaInput}
          onChange={(e) => setTextareaInput(e.target.value)}
          style={{ width: '100%', height: '100px' }}
          maxLength={500}
          placeholder={t(LOCAL_TEXT.I_HAVE_MY_OWN_CLOTHING_BRAND_CALLED)}
        />
        <Button
          disabled={textareaInput === ''}
          style={{ width: '100%', height: '45px', fontSize: '18px' }}
          onClick={() => {
            showSuccessMessage(t(LOCAL_TEXT.APPLICATION_WAS_SENT_UCCESSFULLY));
            navigate('/profile');
          }}
        >
          {t(LOCAL_TEXT.BECOME_ADVERTISER)}
        </Button>
      </Flex>
    </Box>
  );
};

export default BecomeAdvertiserPage;
