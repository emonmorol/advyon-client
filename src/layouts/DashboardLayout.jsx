import React, { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { AIAssistant, useAIAssistant } from '@/components'
import { motion, AnimatePresence } from 'framer-motion'

import { useAuth, RedirectToSignIn } from '@clerk/clerk-react';

const DashboardLayout = () => {
  const { isLoaded, isSignedIn } = useAuth();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true)
  const { isOpen, closeAI, width, setAIWidth } = useAIAssistant()

  if (!isLoaded) {
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

        <main className="flex-1 pr-3 pb-3 overflow-y-auto h-[calc(100vh-4rem)] relative z-10">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-primary -z-10 fixed"></div>

          <div className="bg-background rounded-2xl shadow-2xl min-h-full p-6 text-gray-800">
            <Outlet />
          </div>
        </main>

        {/* AI Panel - Animated Placeholder (like sidebar) */}
        <motion.div
          initial={{ width: 0, marginLeft: 0 }}
          animate={{ width: isOpen ? width : 0, marginLeft: isOpen ? 12 : 0 }}
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
