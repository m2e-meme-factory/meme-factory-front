import toast from 'react-hot-toast';
import { AxiosResponse } from 'axios';

import { isMobileDevice } from './is-mobile-device';

  const isMobile = isMobileDevice();

interface ToastPromiseParams {
  success: string;
  error: string;
  process: string;
  callback: () => Promise<AxiosResponse<any>>;
}

export const showErrorMessage = (message: string) => {
  toast.error(message, {
    style: {
      marginTop: isMobile? '10vh': 'unset',
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      zIndex: 9999999,
    },
  });
};

export const showSuccessMessage = (message: string) => {
  toast.success(message, {
    style: {
      marginTop: isMobile? '10vh': 'unset',
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      zIndex: 9999999,
    },
  });
};

export const showMessage = (message: string) => {
  toast(message, {
    style: {
      marginTop: isMobile? '10vh': 'unset',
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
      zIndex: 9999999,
    },
  });
};

export const showToastWithPromise = async ({
  success,
  error,
  process,
  callback,
}: ToastPromiseParams) => {
  return await toast.promise(
    callback(),
    {
      loading: process,
      success: success,
      error: error,
    },
    {
      style: {
        marginTop: isMobile? '10vh': 'unset',
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
        zIndex: '9999999 !important',
      },
    }
  );
};
