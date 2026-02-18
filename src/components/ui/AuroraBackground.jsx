import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const blobs = [
  { size: 420, delay: 0, color: 'rgba(16, 185, 129, 0.35)', x: '-15%', y: '-20%' },
  { size: 520, delay: 2, color: 'rgba(255, 255, 255, 0.18)', x: '40%', y: '-10%' },
  { size: 460, delay: 4, color: 'rgba(14, 45, 44, 0.5)', x: '20%', y: '35%' },
];

export default function AuroraBackground({ children, className, disableAnimation = false }) {
  return (
    <div className={cn('relative isolate overflow-hidden bg-[#050b14] text-white', className)}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(92,219,214,0.15),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(229,149,0,0.15),transparent_55%)]" />

      {blobs.map(blob =>
        disableAnimation ? (
          <span
            key={blob.color}
            className="absolute blur-3xl rounded-full opacity-80"
            style={{
              width: blob.size,
              height: blob.size,
              background: blob.color,
              left: blob.x,
              top: blob.y,
            }}
            aria-hidden="true"
          />
        ) : (
          <motion.span
            key={blob.color}
            className="absolute blur-3xl rounded-full"
            style={{
              width: blob.size,
              height: blob.size,
              background: blob.color,
              left: blob.x,
              top: blob.y,
            }}
            aria-hidden="true"
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, 12, -6, 0],
              x: ['0%', '4%', '-3%', '0%'],
              y: ['0%', '-4%', '3%', '0%'],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              delay: blob.delay,
              ease: 'easeInOut',
            }}
          />
        ),
      )}

      <div className="relative z-10">{children}</div>

      <div className="pointer-events-none absolute inset-0 border border-white/5 shadow-[0_0_120px_rgba(4,12,24,0.5)]" />
    </div>
  );
}
