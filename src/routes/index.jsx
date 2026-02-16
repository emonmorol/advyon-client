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
import CreateEventPage from '@/pages/dashboard/CreateEventPage';
import SchedulePage from '@/pages/dashboard/SchedulePage';
import DocumentViewerPage from '@/pages/dashboard/DocumentViewerPage';
import TextReviewPage from '@/pages/dashboard/TextReviewPage';
import ProfilePage from '@/pages/dashboard/ProfilePage';
import AnalyticsPage from '@/pages/dashboard/AnalyticsPage';

import AuthLayout from '@/layouts/AuthLayout';
import AuthSuccessPage from '@/pages/auth/AuthSuccessPage';
import RequireRole from '@/components/auth/RequireRole';

import CommunityHubPage from '@/pages/dashboard/CommunityHubPage';
import ClientsPage from '@/pages/dashboard/ClientsPage';
import LawyerVerificationPage from '@/pages/dashboard/LawyerVerificationPage';
import LegalSearchPage from '@/pages/dashboard/LegalSearchPage';
import AskQuestionPage from '@/pages/dashboard/AskQuestionPage';
import ThreadDetailPage from '@/pages/dashboard/ThreadDetailPage';
import MyDocumentsPage from '@/pages/dashboard/MyDocumentsPage';
import ComingSoonPage from '@/pages/ComingSoonPage';
import AIToolsPage from '@/pages/dashboard/AIToolsPage';

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
      { path: 'workspace/:caseId', element: <WorkspacePage /> },
      { path: 'cases/new', element: <CreateCasePage /> },
      { path: 'profile/verify', element: <LawyerVerificationPage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'schedule/new', element: <CreateEventPage /> },
      { path: 'community', element: <CommunityHubPage /> },
      { path: 'community/ask', element: <CommunityHubPage /> }, 
      { path: 'community/verified', element: <CommunityHubPage /> }, 
      { path: 'community/thread/:threadId', element: <ThreadDetailPage /> },
      
      { path: 'legal', element: <LegalSearchPage /> },
      { path: 'workspace/doc/:docId', element: <DocumentViewerPage /> },
      { path: 'review/:docId', element: <TextReviewPage /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'cases/active', element: <ComingSoonPage title="Active Cases" /> },
      { path: 'cases/archived', element: <ComingSoonPage title="Archived Cases" /> },
      { path: 'documents', element: <MyDocumentsPage /> },
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
            <AnalyticsPage />
          </RequireRole>
        ) 
      },
      { path: 'settings', element: <ComingSoonPage title="Settings" /> },
      { path: 'legal-database', element: <ComingSoonPage title="Legal Database" /> },
      { path: 'ai-assistant', element: <AIToolsPage /> }
    ],
    errorElement: <div className="p-8 text-red-500">Dashboard Error Boundary</div>
  },
]);
