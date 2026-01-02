import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import Home from '@/pages/Home';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import OnboardingPage from '@/pages/OnboardingPage';
import WorkspacePage from '@/pages/WorkspacePage';
import DocumentViewerPage from '@/pages/dashboard/DocumentViewerPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';

import AuthLayout from '@/layouts/AuthLayout';
import AuthSuccessPage from '@/pages/auth/AuthSuccessPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'auth',
        element: <AuthLayout />,
        children: [
          { path: 'signin', element: <SignInPage /> },
          { path: 'signup', element: <SignUpPage /> },
          { path: 'success', element: <AuthSuccessPage /> },
        ],
      },
      {
        path: 'onboarding',
        element: <OnboardingPage />,
      },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'workspace', element: <WorkspacePage /> },
      { path: 'workspace/doc/:docId', element: <DocumentViewerPage /> },
      { path: 'profile', element: <ProfilePage /> }
    ],
  },
]);
