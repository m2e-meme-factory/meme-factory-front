import React, { useCallback, useEffect } from 'react';
import { Flex, Heading, TextArea, Text, Button, Box } from '@radix-ui/themes';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useNavigate } from 'react-router-dom';

import { showSuccessMessage } from '@shared/utils/helpers/notify';

const BecomeAdvertiserPage = () => {
  const [textareaInput, setTextareaInput] = React.useState('');
  const navigate = useNavigate();
  const webapp = useWebApp();

  const handleBack = useCallback(() => {
    navigate(-1);
    webapp.BackButton.hide();
  }, [navigate, webapp]);

  useEffect(() => {
    webapp.ready();
    webapp.BackButton.show();
    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, webapp]);

  return (
    <Box m='4'>
      <Flex direction='column' justify='start' align='start' gap='2'>
        <Heading>
          Become <span style={{ color: '#fecf0a' }}>partner</span>
        </Heading>
        <Text>Provide some information about your project:</Text>
        <TextArea
          value={textareaInput}
          onChange={(e) => setTextareaInput(e.target.value)}
          style={{ width: '100%', height: '100px' }}
          maxLength={500}
          placeholder='I have my own clothing brand called...'
        />
        <Button
          disabled={textareaInput === ''}
          style={{ width: '100%', height: '45px', fontSize: '18px' }}
          onClick={() => {
            showSuccessMessage('Application was sent successfully!');
            navigate('/profile');
          }}
        >
          Become Advertiser
        </Button>
      </Flex>
    </Box>
  );
};

export default BecomeAdvertiserPage;
