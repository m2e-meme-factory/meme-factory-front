import { createBrowserRouter } from 'react-router-dom';
import BasePageWrapper from './shared/components/BasePageWrapper';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import About from './pages/AboutPage/About';
import VerifyForm from './pages/VerifyPage/VerifyForm';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage/ProfileSettingsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import FreelancerLogsPage from './pages/FreelancerLogsPage/FreelancerLogsPage';
import { ROUTES } from './shared/consts/routes';
import React from 'react';
import ProtectedRoute from './shared/components/ProtectedRoute';
import TasksPage from './pages/PublicProjectsPage/TasksPage';
import ProjectPage from './pages/ProjectPage/ProjectPage';

export const router = createBrowserRouter([
  {
    path: ROUTES.HOME,
    element: <BasePageWrapper />,
    children: [
      {
        path: ROUTES.PROFILE,
        element: <ProtectedRoute element={<ProfilePage />} />,
      },
      {
        path: ROUTES.PROJECT_PAGE,
        element: <ProtectedRoute element={<ProjectPage />} />,
      },
      {
        path: ROUTES.PUBLIC_PROJECTS,
        element: <ProtectedRoute element={<TasksPage />} />,
      },
      {
        path: ROUTES.ABOUT,
        element: <About />,
      },
      {
        path: ROUTES.VERIFY,
        element: <VerifyForm />,
      },
      {
        path: ROUTES.CREATE_PROJECT,
        element: <ProtectedRoute element={<CreateProjectPage />} />,
      },
      {
        path: ROUTES.PROFILE_SETTINGS,
        element: <ProtectedRoute element={<ProfileSettingsPage />} />,
      },
      {
        path: ROUTES.PROJECT_DETAILS,
        element: <ProtectedRoute element={<ProjectDetailsPage />} />,
      },
      {
        path: ROUTES.LOGS,
        element: <ProtectedRoute element={<FreelancerLogsPage />} />,
      },
    ],
  },
]);
