import { RouterProvider } from 'react-router-dom';
import { Theme } from '@radix-ui/themes';

import { router } from './Router';

import './App.css';

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
