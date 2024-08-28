import React, { FC, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useLogin } from '../utils/api/hooks/auth/useLogin';
import { Flex, Spinner } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/redux/user/userSlice';
import Tutorial from './Tutorial';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { webApp } = useTelegram();
  const { isLoading, data, error } = useLogin(webApp?.initData);
  const location = useLocation();
  const dispatch = useDispatch();

  const [isTutorialCompleted, setIsTutorialCompleted] = useState(
    localStorage.getItem('onboardCompleted') === 'true'
  );

  useEffect(() => {
    if (data) {
      dispatch(setUser(data.data.user));
      localStorage.setItem('token', data.data.token);
    }
  }, [data, dispatch]);

  useEffect(() => {
    if (localStorage.getItem('onboardCompleted') === 'true') {
      setIsTutorialCompleted(true);
    }
  }, [isTutorialCompleted]);

  if (isLoading) {
    return (
      <Flex style={{ height: '100vh' }} align='center' justify='center'>
        <Spinner size='3' />
      </Flex>
    );
  }

  if (!isTutorialCompleted) {
    return <Tutorial onComplete={() => setIsTutorialCompleted(true)} />;
  }

  if (error) {
    return <Navigate to='/projects' state={{ from: location }} />;
  }

  return element;
};

export default ProtectedRoute;
