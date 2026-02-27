import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import ScalesOfJustice3D from './ScalesOfJustice3D';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      {/* 3D Background */}
      <ScalesOfJustice3D />

      {/* Content overlay */}
      <div className="relative z-10 px-8 md:px-24 pt-28">
        <div className="max-w-4xl">
          {/* Tag */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="landing-section-tag">
              <Sparkles className="w-3 h-3 inline mr-1" />
              v2.5 PREVIEW
            </span>
            <span className="text-teal-accent/60 text-xs font-medium">
              | Legal Intelligence Reimagined
            </span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="text-5xl sm:text-7xl lg:text-9xl font-extrabold mb-8 leading-[0.9] tracking-tighter text-white"
          >
            Empowering <br />
            <span className="text-teal-bright landing-text-glow">Justice</span> with AI.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
            className="text-lg md:text-2xl text-gray-400 mb-12 max-w-2xl leading-relaxed"
          >
            ADVYON is a comprehensive legal case collaboration platform that bridges
            the gap between Lawyers, Clients, and Data through intelligent automation
            and shared workspaces.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
            className="flex flex-wrap gap-5"
          >
            <SignedOut>
              <Link
                to="/auth/signup"
                className="landing-btn-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl inline-flex items-center gap-3 group"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                to="/dashboard"
                className="landing-btn-primary px-10 py-5 rounded-2xl font-bold text-lg shadow-2xl inline-flex items-center gap-3 group"
              >
                Go to Dashboard
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </SignedIn>
            <button
              onClick={() => document.querySelector('#workspace')?.scrollIntoView({ behavior: 'smooth' })}
              className="landing-glass-card px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/5 border-white/10 text-white"
            >
              Explore Platform
            </button>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-6 h-10 border-2 border-teal-accent/40 rounded-full flex justify-center pt-2"
        >
          <div className="w-1.5 h-1.5 bg-teal-bright rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
