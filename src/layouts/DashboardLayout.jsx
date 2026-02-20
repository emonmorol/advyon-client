import React, { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { AIAssistant, useAIAssistant } from '@/components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthApi } from '../hooks/useAuthApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';
import SystemBootLoader from '@/components/ui/SystemBootLoader';

/**
 * DashboardLayout — WBS-1.3
 * Uses syncUserWithRetry for resilient post-login synchronization
 * with fallback to onboarding on unrecoverable failures.
 */
const DashboardLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { syncUserWithRetry } = useAuthApi();
  const { fetchProfile } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const { isOpen, closeAI, width, setAIWidth } = useAIAssistant()
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState(null);
  const [isRetrying, setIsRetrying] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const isWorkspaceRoute = location.pathname.startsWith('/dashboard/workspace');

  // WBS-1.3: Resilient sync with retry logic
  const performSync = React.useCallback(async () => {
    setIsSyncing(true);
    setSyncError(null);

    try {
      const { data: res, error } = await syncUserWithRetry();

      if (error) {
        setSyncError(error);
        return;
      }

      if (res?.needsOnboarding || res?.data?.needsOnboarding) {
        navigate('/onboarding');
        return;
      }

      // Fetch user profile to populate Zustand store with role/data
      await fetchProfile();
    } catch (error) {
      console.error("Unexpected sync failure:", error);
      setSyncError("Authentication synchronization failed. Please try again.");
    } finally {
      setIsSyncing(false);
      setIsRetrying(false);
    }
  }, [syncUserWithRetry, navigate, fetchProfile]);

  // Initial sync on login
  React.useEffect(() => {
    if (isLoaded && isSignedIn) {
      performSync();
    } else if (isLoaded) {
      setIsSyncing(false);
    }
  }, [isSignedIn, isLoaded]);  // eslint-disable-line react-hooks/exhaustive-deps

  // WBS-1.3: Manual retry handler
  const handleRetry = () => {
    setIsRetrying(true);
    performSync();
  };

  // WBS-1.3: Fallback to onboarding if sync is unrecoverable
  const handleFallbackOnboarding = () => {
    navigate('/onboarding');
  };

  if (syncError) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#1C4645] text-white gap-4 px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-2">
          <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold">Sync Failed</h2>
        <p className="text-gray-300 max-w-md">{syncError}</p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="px-6 py-2 bg-teal-500 rounded-lg hover:bg-teal-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </button>
          <button
            onClick={handleFallbackOnboarding}
            className="px-6 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition border border-white/20"
          >
            Go to Setup
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded || (isSignedIn && isSyncing)) {
    return <SystemBootLoader minimal message="Synchronizing Workspace..." minDuration={0} />;
  }

  if (!isSignedIn) {
    return <RedirectToSignIn />;
  }

  return (
    <div className="min-h-screen bg-[#1C4645] text-foreground flex flex-col">
      <Navbar />
      <div className="flex flex-1 relative overflow-hidden">
        {/* Left Sidebar - Animated Placeholder */}
        <motion.div
          initial={{ width: 80 }}
          animate={{ width: isSidebarCollapsed ? 80 : 250 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="hidden md:block shrink-0"
        />

        <Sidebar
          className="hidden md:flex"
          isCollapsed={isSidebarCollapsed}
          onMouseEnter={() => setIsSidebarCollapsed(false)}
          onMouseLeave={() => setIsSidebarCollapsed(true)}
        />

        <main className="flex-1 pr-1 pb-3 h-[calc(100vh-4rem)] relative z-10 flex flex-col">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-primary -z-10 fixed"></div>

          <div className={`bg-background rounded-2xl shadow-2xl flex-1 text-gray-800 ${
            isWorkspaceRoute ? 'overflow-hidden p-0' : 'overflow-y-auto'
          }`}>
            <Outlet />
          </div>
        </main>

        {/* AI Panel - Animated Placeholder (like sidebar) */}
        <motion.div
          initial={{ width: 0, marginLeft: 0 }}
          animate={{ width: isOpen ? width : 0, marginLeft: isOpen ? 6 : 0 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 200
          }}
          className="shrink-0"
        />

        {/* AI Assistant Panel - Fixed position (like sidebar) */}
        <AnimatePresence mode="wait">
          {isOpen && (
            <AIAssistant
              isOpen={isOpen}
              onClose={closeAI}
              width={width}
              onWidthChange={setAIWidth}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default DashboardLayout
