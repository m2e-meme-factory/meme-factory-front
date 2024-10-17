import './shared/consts/polyfills.ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@radix-ui/themes/styles.css';
import './index.css';
import ProviderWrapper from './ProviderWrapper';
import { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <ProviderWrapper>
      <App />
    </ProviderWrapper>
    <Toaster
      position='top-center'
      containerStyle={{ zIndex: '99999 !important' }}
      toastOptions={{ style: { zIndex: '99999 !important' }, duration: 5000 }}
      reverseOrder={false}
    />
  </React.StrictMode>
);

reportWebVitals();
