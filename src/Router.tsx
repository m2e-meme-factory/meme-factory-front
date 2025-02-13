import { createBrowserRouter } from 'react-router-dom';

import ProtectedRoute from '@shared/components/ProtectedRoute';
import ErrorPage from '@pages/ErrorPage/ErrorPage';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage';
import UnauthorizedPage from '@pages/UnauthorizedPage/UnauthorizedPage';
import AllTasks from '@pages/ProfilePage/AllTasks';
import PostMemePage from '@pages/ProfilePage/PostMemePage';
import Friends from '@pages/FriendsPage/Friends';
import BecomeAdvertiserPage from '@pages/BecomeAdvertiserPage/BecomeAdvertiserPage';
import ProfilePage from '@pages/ProfilePage/ProfilePage';
import ProjectLogsPage from '@pages/ProjectLogsPage/ProjectLogsPage';
import TutorialPage from '@pages/TutorialPage/TutorialPage';
import WalletPage from '@pages/WalletPage/WalletPage';
import PageWrapper from '@shared/components/PageWrapper';
import { ROUTES } from '@shared/consts';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <ProtectedRoute element={<PageWrapper />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.POST_MEME,
        element: <ProtectedRoute element={<PostMemePage />} />,
      },
      {
        path: ROUTES.FRIENDS,
        element: <Friends />,
      },      
      {
        path: ROUTES.BECOME_ADVERTISER,
        element: <BecomeAdvertiserPage />,
      },
      {
        path: ROUTES.ALL_TASKS,
        element: <AllTasks />,
      },
    ],
  },
  {
    path: ROUTES.HOME,
    element: <ProtectedRoute element={<PageWrapper />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.WALLET,
        element: <WalletPage />,
      },
    ],
  },

  {
    path: ROUTES.LOGS,
    element: <ProtectedRoute element={<ProjectLogsPage />} />,
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: <UnauthorizedPage />,
  },
  {
    path: ROUTES.TUTORIAL,
    element: <TutorialPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);
