import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";

export const PageHero = ({ 
  title, 
  subtitle, 
  badge,
  children 
}) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="container mx-auto px-6 lg:px-12 text-center relative z-10">
            
            {badge && (
                <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="inline-flex items-center gap-2 rounded-full bg-teal-500/10 px-4 py-1.5 text-sm font-medium text-teal-300 border border-teal-500/20 mb-8 backdrop-blur-md"
                >
                    <BadgeCheck className="h-4 w-4" />
                    <span>{badge}</span>
                </motion.div>
            )}

            <motion.h1 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl font-bold tracking-tight text-white sm:text-7xl mb-6 leading-tight"
            >
                {title}
            </motion.h1>

            <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-xl text-emerald-100/70 max-w-3xl mx-auto mb-10 font-light"
            >
                {subtitle}
            </motion.p>

            {children && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {children}
                </motion.div>
            )}
        </div>
        
        {/* Decorative Blur behind hero */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none z-0" />
    </section>
  );
};
