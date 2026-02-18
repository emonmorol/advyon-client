import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const pseudoRandom = (seed) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const FloatingParticles = () => {
  const particles = useMemo(() => {
    const width = typeof window !== 'undefined' ? window.innerWidth : 1024;
    const height = typeof window !== 'undefined' ? window.innerHeight : 768;

    return Array.from({ length: 20 }).map((_, index) => {
      const seed = index + 1;
      const nextSeed = seed + 0.5;

      return {
        initial: {
          x: pseudoRandom(seed) * width,
          y: pseudoRandom(seed * 1.3) * height,
          scale: 0.5 + pseudoRandom(seed * 2) * 0.5,
        },
        animate: {
          y: [null, -50 - pseudoRandom(seed * 3) * 100],
          x: [null, (pseudoRandom(seed * 4) - 0.5) * 60],
        },
        transition: {
          duration: 10 + pseudoRandom(seed * 5) * 10,
          repeat: Infinity,
          ease: 'linear',
          repeatType: 'mirror',
        },
        style: {
          width: 50 + pseudoRandom(seed * 6) * 70,
          height: 50 + pseudoRandom(seed * 7) * 70,
        },
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-[#3A7573] opacity-20"
          initial={particle.initial}
          animate={particle.animate}
          transition={particle.transition}
          style={{
            ...particle.style,
            filter: 'blur(40px)',
          }}
        />
      ))}
    </div>
  );
};

export default FloatingParticles;
