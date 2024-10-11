import React from 'react';
import './App.css';
import { Theme } from '@radix-ui/themes';
import { RouterProvider } from 'react-router-dom';
import { router } from './Router';

function App() {
  return (
    <Theme
      accentColor='yellow'
      appearance={'dark'}
      grayColor='mauve'
      radius='medium'
      hasBackground={false}
    >
      <RouterProvider router={router} />
    </Theme>
  );
}

export default App;
