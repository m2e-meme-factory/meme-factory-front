import { useWebApp } from '@vkruglikov/react-telegram-web-app';
import { useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const WebappBackButton = () => {
  const webapp = useWebApp();
  const navigate = useNavigate();

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

  return <></>;
};

export default WebappBackButton;
