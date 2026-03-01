import { motion } from 'framer-motion';
import { Sparkles, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

export default function SystemBootLoader({
  onComplete,
  message = 'Initializing Advyon Core...',
  minDuration = 2000,
  minimal = false,
}) {
  useEffect(() => {
    if (!onComplete || minDuration <= 0) {
      return;
    }

    const timer = setTimeout(() => {
      onComplete();
    }, minDuration);

    return () => clearTimeout(timer);
  }, [onComplete, minDuration]);

  const containerClasses = minimal
    ? 'flex min-h-screen w-full items-center justify-center bg-[#001514] text-teal-400 font-mono'
    : 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#001514] text-teal-400 font-mono';

  const spinnerSize = minimal ? 'h-10 w-10' : 'h-12 w-12';
  const textClasses = minimal ? 'text-xs tracking-[0.25em]' : 'text-sm tracking-[0.3em]';

  return (
    <div className={containerClasses}>
      <div className={`${minimal ? 'mr-3' : 'mb-4 text-4xl'}`}>
        {minimal ? (
          <Loader2 className={`animate-spin ${spinnerSize}`} />
        ) : (
          <Sparkles className={`animate-spin ${spinnerSize}`} />
        )}
      </div>
      <div className={`${textClasses} uppercase text-center animate-pulse`}>{message}</div>

      {!minimal && minDuration > 0 && (
        <div className="mt-8 h-1 w-64 overflow-hidden rounded-full bg-teal-900">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: (minDuration / 1000) * 0.9, ease: 'easeInOut' }}
            className="h-full bg-teal-400 shadow-[0_0_10px_#2dd4bf]"
          />
        </div>
      )}
    </div>
  );
}
