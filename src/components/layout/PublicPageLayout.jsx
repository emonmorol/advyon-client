import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LandingNavbar from '@/components/layout/LandingNavbar';
import Footer from '@/components/layout/Footer';
import LegalScene from '@/components/3d/LegalScene';
import { motion, AnimatePresence } from 'framer-motion';

export default function PublicPageLayout({ children, title, description }) {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    if (title) {
      document.title = `${title} | Advyon`;
    }
    if (description) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
            metaDescription = document.createElement('meta');
            metaDescription.name = "description";
            document.head.appendChild(metaDescription);
        }
        metaDescription.content = description;
    }
  }, [pathname, title, description]);

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#001514] text-white selection:bg-teal-500/30 selection:text-teal-50 font-sans">
      
      {/* 3D Background - Fixed & Locked */}
      <div className="fixed inset-0 z-0 h-screen w-screen pointer-events-auto">
        <LegalScene />
      </div>
      
      {/* Enhanced Gradient Overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-r from-[#001514] via-[#001514]/60 to-transparent pointer-events-none" />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-[#001514]/20 to-[#001514] pointer-events-none" />

      {/* Navigation */}
      <LandingNavbar />

      {/* Main Content with Transition */}
      <main className="relative z-10 flex flex-col min-h-screen">
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="flex-grow"
            >
                {children}
            </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
