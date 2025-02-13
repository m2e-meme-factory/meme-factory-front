import { useCallback, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useWebApp } from '@vkruglikov/react-telegram-web-app';

import { ROUTES } from '@shared/consts';

const WebappBackButton = () => {
  const webapp = useWebApp();
  const navigate = useNavigate();
  const location = useLocation();

  webapp.ready();

  const handleBack = useCallback(() => {
    navigate(ROUTES.PROFILE);
    webapp.BackButton.hide();
  }, [navigate, webapp]);

  useEffect(() => {
    if (location.pathname !== ROUTES.PROFILE) {
      webapp.BackButton.show();
    } else {
      webapp.BackButton.hide();
    }

    webapp.onEvent('backButtonClicked', handleBack);

    return () => {
      webapp.offEvent('backButtonClicked', handleBack);
      webapp.BackButton.hide();
    };
  }, [handleBack, location.pathname, webapp]);

  return <></>;
};

export default WebappBackButton;
