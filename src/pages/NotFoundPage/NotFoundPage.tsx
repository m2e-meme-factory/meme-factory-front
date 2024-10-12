import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Flex, Heading, Text } from '@radix-ui/themes';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useEffect } from 'react';
import { AccentButton } from '../../shared/components/Buttons/GlowingButton';
import { ResponsibleImage } from '../../shared/components/ResponsibleImage';
import eyes from '../../shared/imgs/eyes.webp';

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
    <Flex direction='column' m='4' pt='6' justify='center' align='center' gap='4'>
      <ResponsibleImage src={eyes} />
      <Heading>Oops, nothing found...</Heading>
      <Text>{location.pathname}</Text>
      <AccentButton mt='3' onClick={() => navigate('/projects')}>
        To main
      </AccentButton>
    </Flex>
  );
};
export default NotFoundPage;
