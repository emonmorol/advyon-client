import { Link } from 'react-router-dom';
import { SignedIn, SignedOut } from '@clerk/clerk-react';
import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

export default function CTASection() {
  return (
    <section className="py-32 px-8 text-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.5 }}
        transition={{ duration: 0.7 }}
        className="max-w-4xl mx-auto landing-glass-card p-14 md:p-20 border-teal-accent/30 bg-primary/20"
      >
        <Rocket className="w-12 h-12 text-teal-bright mx-auto mb-6 opacity-60" />
        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 leading-tight text-white">
          Ready to Evolve <br />
          Your Practice?
        </h2>
        <p className="text-lg md:text-xl text-gray-400 mb-10">
          Join legal professionals using ADVYON to win more cases.
        </p>
        <div className="flex justify-center gap-6 flex-wrap">
          <SignedOut>
            <Link
              to="/auth/signup"
              className="landing-btn-primary px-12 md:px-16 py-5 md:py-6 rounded-2xl font-black text-xl md:text-2xl shadow-xl"
            >
              Get Started Free
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              to="/dashboard"
              className="landing-btn-primary px-12 md:px-16 py-5 md:py-6 rounded-2xl font-black text-xl md:text-2xl shadow-xl"
            >
              Open Dashboard
            </Link>
          </SignedIn>
        </div>
        <p className="mt-8 text-gray-500 text-sm">
          No credit card required. Demo available for law firms.
        </p>
      </motion.div>
    </section>
  );
}
