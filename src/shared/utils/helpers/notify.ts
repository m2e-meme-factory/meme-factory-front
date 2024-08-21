import toast from 'react-hot-toast';
import { AxiosResponse } from 'axios';

interface ToastPromiseParams {
  success: string;
  error: string;
  process: string;
  callback: () => Promise<AxiosResponse<any>>;
}

export const showErrorMessage = (message: string) => {
  toast.error(message, {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export const showSuccessMessage = (message: string) => {
  toast.success(message, {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export const showMessage = (message: string) => {
  toast(message, {
    style: {
      borderRadius: '10px',
      background: '#333',
      color: '#fff',
    },
  });
};

export const showToastWithPromise = async ({
  success,
  error,
  process,
  callback,
}: ToastPromiseParams) => {
  await toast.promise(
    callback(),
    {
      loading: process,
      success: success,
      error: error,
    },
    {
      style: {
        borderRadius: '10px',
        background: '#333',
        color: '#fff',
      },
    }
  );
};
