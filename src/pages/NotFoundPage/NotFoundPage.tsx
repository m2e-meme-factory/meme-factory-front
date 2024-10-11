import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useEffect } from 'react';

const NotFoundPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const webapp = useWebApp();

  useEffect(() => {
    webapp.ready();

    const backButton = webapp.BackButton;
    backButton.show();
    backButton.onClick(function () {
      backButton.hide();
    });

    const handleBack = () => {
      navigate(-1);
      backButton.hide();
    };

    webapp.onEvent('backButtonClicked', handleBack);
  }, [navigate, webapp]);

  return (
    <Flex direction='column' m='4'>
      <Heading>404: Page Not Found</Heading>
      <Text>{location.pathname}</Text>
      <Button mt='3' onClick={() => navigate('/projects')}>
        To main
      </Button>
    </Flex>
  );
};
export default NotFoundPage;
