import { createBrowserRouter } from 'react-router-dom';
import AppLayout from '@/layouts/AppLayout';
import Home from '@/pages/Home';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import DashboardLayout from '@/layouts/DashboardLayout';
import Dashboard from '@/pages/Dashboard';
import OnboardingPage from '@/pages/OnboardingPage';
import WorkspacePage from '@/pages/WorkspacePage';
import CreateCasePage from '@/pages/CreateCasePage';
import DocumentViewerPage from '@/pages/dashboard/DocumentViewerPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';

import AuthLayout from '@/layouts/AuthLayout';
import AuthSuccessPage from '@/pages/auth/AuthSuccessPage';
import RequireRole from '@/components/auth/RequireRole';

import CommunityHubPage from '@/pages/dashboard/CommunityHubPage';
import ClientsPage from '@/pages/dashboard/ClientsPage';
import LawyerVerificationPage from '@/pages/dashboard/LawyerVerificationPage';
import LegalSearchPage from '@/pages/dashboard/LegalSearchPage';
import AskQuestionPage from '@/pages/dashboard/AskQuestionPage';
import ThreadDetailPage from '@/pages/dashboard/ThreadDetailPage';
import ComingSoonPage from '@/pages/ComingSoonPage';

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
      { path: 'cases/new', element: <CreateCasePage /> },
      { path: 'profile/verify', element: <LawyerVerificationPage /> },
      { path: 'cases/new', element: <CreateCasePage /> },
      { path: 'community', element: <CommunityHubPage /> },
      { path: 'community/ask', element: <CommunityHubPage /> }, // Placeholder
      { path: 'community/verified', element: <CommunityHubPage /> }, // Placeholder
      { path: 'community/thread/:threadId', element: <ThreadDetailPage /> },
      
      { path: 'legal', element: <LegalSearchPage /> },
      { path: 'workspace/doc/:docId', element: <DocumentViewerPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'cases/active', element: <ComingSoonPage title="Active Cases" /> },
      { path: 'cases/archived', element: <ComingSoonPage title="Archived Cases" /> },
      { path: 'documents', element: <ComingSoonPage title="My Documents" /> },
      { 
        path: 'clients', 
        element: (
          <RequireRole allowedRoles={['lawyer', 'admin']}>
            <ClientsPage />
          </RequireRole>
        ) 
      },
      { 
        path: 'analytics', 
        element: (
          <RequireRole allowedRoles={['lawyer', 'admin']}>
            <ComingSoonPage title="Analytics" />
          </RequireRole>
        ) 
      },
      { path: 'settings', element: <ComingSoonPage title="Settings" /> },
      { path: 'legal-database', element: <ComingSoonPage title="Legal Database" /> },
      { path: 'ai-assistant', element: <ComingSoonPage title="AI Tools" /> }
    ],
    errorElement: <div className="p-8 text-red-500">Dashboard Error Boundary</div>
  },
]);
