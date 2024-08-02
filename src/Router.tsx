import { createBrowserRouter } from 'react-router-dom';
import { ROUTES } from './shared/consts/routes';
import BasePageWrapper from './shared/components/BasePageWrapper';
import ProfilePage from './pages/ProfilePage/ProfilePage';
import TaskPage from './pages/TaskPage/TaskPage';
import TasksPage from './pages/TasksPage/TasksPage';
import About from './pages/AboutPage/About';
import VerifyForm from './pages/VerifyPage/VerifyForm';
import MyProjectsPage from './pages/MyProjectsPage/MyProjectsPage';
import CreateProjectPage from './pages/CreateProjectPage/CreateProjectPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage/ProfileSettingsPage';
import React from 'react';
import ProjectDetailsPage from './pages/ProjectDetailsPage/ProjectDetailsPage';
import FreelancerLogsPage from './pages/FreelancerLogsPage/FreelancerLogsPage';

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
        path: ROUTES.LOGS,
        element: <FreelancerLogsPage />,
      },
    ],
  },
]);
