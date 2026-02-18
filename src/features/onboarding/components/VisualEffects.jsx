import React, { useEffect, useMemo } from 'react';
import { motion, useMotionTemplate, useMotionValue, animate } from 'framer-motion';

// --- Theme Constants (Brand Colors) ---
export const BRAND = {
    deep: '#1C4645',    // Main Brand Color
    surface: '#1D4746', // Dark Surface
    accent: '#3A7573',  // Highlight
    accentLight: '#3C726F',
    textMain: '#FFFFFF',
    textLight: '#B0C4C3',
};

const pseudoRandom = (seed) => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
};

export const FloatingParticles = () => {
    const particles = useMemo(() => {
        const width = typeof window !== 'undefined' ? window.innerWidth : 1200;
        const height = typeof window !== 'undefined' ? window.innerHeight : 800;

        return Array.from({ length: 15 }).map((_, index) => {
            const seed = index + 1;
            return {
                initial: {
                    x: pseudoRandom(seed) * width,
                    y: pseudoRandom(seed * 1.4) * height,
                    scale: 0.5 + pseudoRandom(seed * 2) * 0.5,
                },
                animate: {
                    y: [null, -80 - pseudoRandom(seed * 3) * 80],
                    x: [null, (pseudoRandom(seed * 4) - 0.5) * 60],
                },
                transition: {
                    duration: 15 + pseudoRandom(seed * 5) * 15,
                    repeat: Infinity,
                    ease: 'linear',
                    repeatType: 'mirror',
                },
                style: {
                    width: 20 + pseudoRandom(seed * 6) * 60,
                    height: 20 + pseudoRandom(seed * 7) * 60,
                },
            };
        });
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
            {particles.map((particle, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full opacity-20"
                    style={{
                        backgroundColor: BRAND.accent,
                        width: particle.style.width,
                        height: particle.style.height,
                        filter: 'blur(20px)',
                    }}
                    initial={particle.initial}
                    animate={particle.animate}
                    transition={particle.transition}
                />
            ))}
        </div>
    );
};

export const MouseSpotlight = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    useEffect(() => {
        const handleMouseMove = ({ clientX, clientY }) => {
            animate(mouseX, clientX, { duration: 0.2, ease: "linear" });
            animate(mouseY, clientY, { duration: 0.2, ease: "linear" });
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    const background = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(58, 117, 115, 0.15), transparent 80%)`;

    return (
        <motion.div
            className="pointer-events-none fixed inset-0 z-10 duration-300"
            style={{ background }}
        />
    );
};
