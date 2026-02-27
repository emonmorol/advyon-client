import { Scale } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="py-16 px-8 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/30 border border-teal-accent/40 rounded-xl flex items-center justify-center">
            <Scale className="w-5 h-5 text-teal-bright" />
          </div>
          <span className="text-2xl font-black tracking-tighter text-white uppercase">
            ADVYON
          </span>
        </div>

        {/* Links */}
        <div className="flex gap-8 md:gap-12 text-gray-500 text-sm font-semibold flex-wrap justify-center">
          <a href="#" className="hover:text-teal-bright transition-colors">Privacy</a>
          <a href="#" className="hover:text-teal-bright transition-colors">Terms</a>
          <a href="#" className="hover:text-teal-bright transition-colors">Security</a>
          <a href="#" className="hover:text-teal-bright transition-colors">API Docs</a>
        </div>

        {/* Copyright */}
        <div className="text-gray-600 text-sm">
          © 2025 ADVYON Technologies Inc.
        </div>
      </div>
    </footer>
  );
}
