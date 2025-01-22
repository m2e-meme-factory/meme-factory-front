import './shared/consts/polyfills.ts';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import '@radix-ui/themes/styles.css';
import './index.css';
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
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
      containerClassName='toaster-container'
      containerStyle={{ zIndex: '3 !important' }}
      toastOptions={{ style: { zIndex: '3 !important', backgroundColor: '#333' }, duration: 5000 }}
      reverseOrder={false}
    />
  </React.StrictMode>
);

reportWebVitals();
