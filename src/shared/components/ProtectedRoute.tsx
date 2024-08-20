import React, { FC } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';
import { useLogin } from '../utils/api/hooks/auth/useLogin';
import { Flex, Spinner } from '@radix-ui/themes';
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/redux/user/userSlice';

interface ProtectedRouteProps {
  element: React.ReactElement;
}

const ProtectedRoute: FC<ProtectedRouteProps> = ({ element }) => {
  const { webApp } = useTelegram();
  const { isLoading, data, error } = useLogin(webApp?.initData);
  const location = useLocation();
  const dispatch = useDispatch();

  if (isLoading) {
    return (
      <Flex style={{ height: '100vh' }} align='center' justify='center'>
        <Spinner size='3' />
      </Flex>
    );
  }

  if (data) {
    dispatch(setUser(data.data.user));
    localStorage.setItem('token', data.data.token);
  }

  if (error) {
    return <Navigate to='/projects' state={{ from: location }} />;
  }

  return element;
};

export default ProtectedRoute;
