import { createBrowserRouter } from 'react-router-dom';
import RouteErrorBoundary from '@/components/RouteErrorBoundary';
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

import AboutPage from '@/pages/AboutPage';
import HowToUsePage from '@/pages/HowToUsePage';
import CareersPage from '@/pages/CareersPage';
import BlogPage from '@/pages/BlogPage';
import TermsPage from '@/pages/TermsPage';
import PrivacyPage from '@/pages/PrivacyPage';
import CookiePolicyPage from '@/pages/CookiePolicyPage';
import SecurityPage from '@/pages/SecurityPage';
import AccessibilityPage from '@/pages/AccessibilityPage';

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
import AdminPanelPage from '@/pages/dashboard/AdminPanelPage';
import BillingPage from '@/pages/dashboard/BillingPage';
import ComingSoonPage from '@/pages/ComingSoonPage';
import AIToolsPage from '@/pages/dashboard/AIToolsPage';
import ContactPage from '@/pages/ContactPage';

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
      {
        path: 'contact',
        element: <ContactPage />,
      },
      { path: 'about', element: <AboutPage /> },
      { path: 'how-to-use', element: <HowToUsePage /> },
      { path: 'careers', element: <CareersPage /> },
      { path: 'blog', element: <BlogPage /> },
      { path: 'terms', element: <TermsPage /> },
      { path: 'privacy', element: <PrivacyPage /> },
      { path: 'cookies', element: <CookiePolicyPage /> },
      { path: 'security', element: <SecurityPage /> },
      { path: 'accessibility', element: <AccessibilityPage /> },
    ],
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: 'workspace', element: <RouteErrorBoundary routeName="Workspace"><WorkspacePage /></RouteErrorBoundary> },
      { path: 'workspace/:caseId', element: <RouteErrorBoundary routeName="Workspace"><WorkspacePage /></RouteErrorBoundary> },
      { path: 'cases/new', element: <CreateCasePage /> },
      { path: 'profile/verify', element: <LawyerVerificationPage /> },
      { path: 'schedule', element: <SchedulePage /> },
      { path: 'schedule/new', element: <CreateEventPage /> },
      { path: 'community', element: <CommunityHubPage /> },
      { path: 'community/ask', element: <CommunityHubPage /> },
      { path: 'community/verified', element: <CommunityHubPage /> },
      { path: 'community/thread/:threadId', element: <ThreadDetailPage /> },

      { path: 'legal', element: <LegalSearchPage /> },
      { path: 'workspace/doc/:docId', element: <RouteErrorBoundary routeName="DocumentViewer"><DocumentViewerPage /></RouteErrorBoundary> },
      { path: 'review/:docId', element: <RouteErrorBoundary routeName="TextReview"><TextReviewPage /></RouteErrorBoundary> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'cases/active', element: <ComingSoonPage title="Active Cases" /> },
      { path: 'cases/archived', element: <ComingSoonPage title="Archived Cases" /> },
      { path: 'documents', element: <RouteErrorBoundary routeName="MyDocuments"><MyDocumentsPage /></RouteErrorBoundary> },
      { path: 'messages', element: <ComingSoonPage title="Messages" /> },
      { path: 'messages/:messageId', element: <ComingSoonPage title="Message Details" /> },
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
      { path: 'ai-assistant', element: <RouteErrorBoundary routeName="AITools"><AIToolsPage /></RouteErrorBoundary> },
      {
        path: 'admin',
        element: (
          <RequireRole allowedRoles={['admin', 'superAdmin']}>
            <AdminPanelPage />
          </RequireRole>
        ),
      },
      {
        path: 'billing',
        element: <BillingPage />,
      },
    ],
    errorElement: <RouteErrorBoundary routeName="Dashboard" />
  },
]);
