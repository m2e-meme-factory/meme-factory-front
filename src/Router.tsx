import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './shared/consts/routes';
import BasePageWrapper from './shared/components/BasePageWrapper';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TaskPage from './pages/TaskPage/TaskPage';
import TasksPage from './pages/TasksPage/TasksPage';
import About from './pages/AboutPage/About';
import VerifyForm from './pages/VerifyPage/VerifyForm';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <BasePageWrapper />,
    children: [
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.TASK,
        element: <TaskPage />,
      },
      {
        path: ROUTES.TASKS,
        element: <TasksPage />,
      },
      {
        path: ROUTES.ABOUT,
        element: <About />,
      },
      {
        path: ROUTES.VERIFY,
        element: <VerifyForm />,
      },
    ],
  },
]);
