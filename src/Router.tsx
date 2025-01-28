import { createBrowserRouter } from 'react-router-dom';
import React, { Suspense } from 'react';
import PageWrapper from '@shared/components/PageWrapper';
import { ROUTES } from '@shared/consts';
import ProtectedRoute from '@shared/components/ProtectedRoute';
import ErrorPage from '@pages/ErrorPage/ErrorPage';
import NotFoundPage from '@pages/NotFoundPage/NotFoundPage';
import UnauthorizedPage from '@pages/UnauthorizedPage/UnauthorizedPage';
import Loading from '@shared/components/Loading';
import AllTasks from '@pages/ProfilePage/AllTasks';
import PostMemePage from '@pages/ProfilePage/PostMemePage';
import Friends from '@pages/FriendsPage/Friends';
import CreateProjectPage from '@pages/CreateProjectPage/CreateProjectPage';
import FastTasksPage from '@pages/AutotasksProject/FastTasksPage';
import BecomeAdvertiserPage from '@pages/BecomeAdvertiserPage/BecomeAdvertiserPage';
import EditProjectPage from '@pages/EditProjectPage/EditProjectPage';
import ProfilePage from '@pages/ProfilePage/ProfilePage';
import ProjectDetailsPage from '@pages/ProjectDetailsPage/ProjectDetailsPage';
import ProjectLogsPage from '@pages/ProjectLogsPage/ProjectLogsPage';
import PublicProjectsPage from '@pages/PublicProjectsPage/PublicProjectsPageV2';
import TutorialPage from '@pages/TutorialPage/TutorialPage';
import WalletPage from '@pages/WalletPage/WalletPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <ProtectedRoute element={<PageWrapper />} />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: ROUTES.POST_MEME,
        element: (
          <ProtectedRoute element={<PostMemePage />} />
        ),
      },
      {
        path: ROUTES.FRIENDS,
        element: (
          <Suspense fallback={<Loading />}>
            <Friends />
          </Suspense>
        ),
      },
      {
        path: ROUTES.CREATE_PROJECT,
        element: (
          <Suspense fallback={<Loading />}>
            <CreateProjectPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PROJECT_DETAILS,
        element: (
          <Suspense fallback={<Loading />}>
            <ProjectDetailsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.EDIT,
        element: (
          <Suspense fallback={<Loading />}>
            <EditProjectPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.AUTOTASKS,
        element: (
          <Suspense fallback={<Loading />}>
            <FastTasksPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.BECOME_ADVERTISER,
        element: (
          <Suspense fallback={<Loading />}>
            <BecomeAdvertiserPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.ALL_TASKS,
        element: (
          <Suspense fallback={<Loading />}>
            <AllTasks />
          </Suspense>
        ),
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
        element: (
          <Suspense fallback={<Loading />}>
            <ProfilePage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.PUBLIC_PROJECTS,
        element: (
          <Suspense fallback={<Loading />}>
            <PublicProjectsPage />
          </Suspense>
        ),
      },
      {
        path: ROUTES.WALLET,
        element: (
          <Suspense fallback={<Loading />}>
            <WalletPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: ROUTES.PROJECT_PAGE,
    element: (
      <Suspense fallback={<Loading />}>
        ProjectPage
      </Suspense>
    ),
  },

  {
    path: ROUTES.LOGS,
    element: (
      <Suspense fallback={<Loading />}>
        <ProtectedRoute element={<ProjectLogsPage />} />
      </Suspense>
    ),
  },
  {
    path: ROUTES.UNAUTHORIZED,
    element: <UnauthorizedPage />,
  },
  {
    path: ROUTES.TUTORIAL,
    element: (
      <Suspense fallback={<Loading />}>
        <TutorialPage />
      </Suspense>
    ),
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);