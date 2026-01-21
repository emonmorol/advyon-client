import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { AIAssistant, useAIAssistant } from '@/components'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuthApi } from '../hooks/useAuthApi';
import { useAuthStore } from '@/store/useAuthStore';
import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

const DashboardLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const { syncUser } = useAuthApi();
  const { fetchProfile } = useAuthStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const { isOpen, closeAI, width, setAIWidth } = useAIAssistant()
  const [isSyncing, setIsSyncing] = useState(true);
  const [syncError, setSyncError] = useState(null);

  const navigate = useNavigate();

  // Sync user with backend on login, then fetch profile
  React.useEffect(() => {
    const sync = async () => {
      if (isSignedIn) {
        try {
          // Step 1: Sync user with backend
          const res = await syncUser();

          if (res?.needsOnboarding || res?.data?.needsOnboarding) {
            navigate('/onboarding');
            return; // Don't stop syncing state if redirecting, or maybe irrelevant as component unmounts
          }

          // Step 2: Fetch user profile to populate Zustand store with role and other data
          // This ensures the Sidebar has the correct user role immediately after login
          await fetchProfile();
        } catch (error) {
          console.error("Sync or profile fetch failed:", error);
          setSyncError("Authentication synchronization failed.");
        } finally {
          setIsSyncing(false);
        }
      } else {
        setIsSyncing(false);
      }
    };

    if (isLoaded) {
       sync();
    }
  }, [isSignedIn, isLoaded, syncUser, navigate, fetchProfile]);

  if (syncError) {
    return (
      <div className="flex flex-col h-screen items-center justify-center bg-[#1C4645] text-white gap-4">
        <p className="text-xl">{syncError}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="px-4 py-2 bg-teal-500 rounded hover:bg-teal-600 transition"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!isLoaded || (isSignedIn && isSyncing)) {
    return <div className="flex h-screen items-center justify-center bg-[#1C4645] text-white">Loading Advyon...</div>;
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

          <div className="bg-background rounded-2xl shadow-2xl flex-1 overflow-y-auto p-6 text-gray-800">
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
