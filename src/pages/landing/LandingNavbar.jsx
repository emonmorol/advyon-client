import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Scale, Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'Workspace', href: '#workspace' },
  { label: 'AI Engine', href: '#ai' },
  { label: 'Roles', href: '#roles' },
  { label: 'Community', href: '#community' },
];

export default function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'py-3 px-6 bg-midnight/80 backdrop-blur-xl border-b border-teal-accent/10 shadow-lg shadow-teal-bright/5'
          : 'py-5 px-8'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 bg-primary rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(92,219,214,0.3)] group-hover:shadow-[0_0_30px_rgba(92,219,214,0.5)] transition-shadow">
            <Scale className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-extrabold tracking-tighter text-white">
            ADV<span className="text-teal-bright">YON</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex gap-10">
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="relative text-sm font-semibold tracking-wide text-gray-400 hover:text-white transition-colors group"
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-teal-bright transition-all duration-300 group-hover:w-full" />
            </button>
          ))}
        </nav>

        {/* Auth buttons */}
        <div className="hidden lg:flex items-center gap-4">
          <SignedIn>
            <Link
              to="/dashboard"
              className="landing-btn-primary px-7 py-2.5 rounded-xl text-sm font-bold"
            >
              Dashboard
            </Link>
          </SignedIn>
          <SignedOut>
            <Link to="/auth/signin" className="text-white font-bold text-sm px-4 hover:text-teal-bright transition-colors">
              Login
            </Link>
            <Link
              to="/auth/signup"
              className="landing-btn-primary px-7 py-2.5 rounded-xl text-sm font-bold"
            >
              Get Started
            </Link>
          </SignedOut>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-2"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:hidden mt-4 pb-4 border-t border-white/10 flex flex-col gap-4 pt-4"
        >
          {navLinks.map((link) => (
            <button
              key={link.href}
              onClick={() => scrollTo(link.href)}
              className="text-gray-300 hover:text-white text-left text-sm font-semibold"
            >
              {link.label}
            </button>
          ))}
          <SignedOut>
            <Link to="/auth/signin" className="text-teal-bright font-bold text-sm">Login</Link>
            <Link to="/auth/signup" className="landing-btn-primary px-6 py-2.5 rounded-xl text-sm font-bold text-center">
              Get Started
            </Link>
          </SignedOut>
          <SignedIn>
            <Link to="/dashboard" className="landing-btn-primary px-6 py-2.5 rounded-xl text-sm font-bold text-center">
              Dashboard
            </Link>
          </SignedIn>
        </motion.div>
      )}
    </motion.header>
  );
}
