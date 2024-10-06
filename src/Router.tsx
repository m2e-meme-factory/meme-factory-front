import { createBrowserRouter } from 'react-router-dom';
import BasePageWrapper from './shared/components/BasePageWrapper';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import Friends from './pages/FriendsPage/Friends';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage/ProfileSettingsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import ProjectLogsPage from './pages/ProjectLogsPage/ProjectLogsPage';
import { ROUTES } from './shared/consts/routes';
import React from 'react';
import ProtectedRoute from './shared/components/ProtectedRoute';
import PublicProjectsPage from './pages/PublicProjectsPage/PublicProjectsPage';
import ProjectPage from './pages/ProjectPage/ProjectPage';
import EditProjectPage from './pages/EditProjectPage/EditProjectPage';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage';
import AutoTasksProject from './pages/AutotasksProject/AutoTasksProject';
import UnauthorizedPage from './pages/UnauthorizedPage/UnauthorizedPage';
import Component from './pages/PublicProjectsPage/PublicProjectsPageV2';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <ProtectedRoute element={<BasePageWrapper />} />,
    children: [
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
      },
      {
        path: ROUTES.PROJECT_PAGE,
        element: <ProjectPage />,
      },
      {
        path: ROUTES.PUBLIC_PROJECTS,
        element: <Component />,
      },
      {
        path: ROUTES.FRIENDS,
        element: <Friends />,
      },
      {
        path: ROUTES.CREATE_PROJECT,
        element: <CreateProjectPage />,
      },
      {
        path: ROUTES.PROFILE_SETTINGS,
        element: <ProfileSettingsPage />,
      },
      {
        path: ROUTES.PROJECT_DETAILS,
        element: <ProjectDetailsPage />,
      },
      {
        path: ROUTES.EDIT,
        element: <EditProjectPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
      {
        path: ROUTES.AUTOTASKS,
        element: <AutoTasksProject />,
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
    path: '*',
    element: <NotFoundPage />,
  },
]);
