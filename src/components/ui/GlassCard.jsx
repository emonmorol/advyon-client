import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const GlassCard = ({ 
  children, 
  className, 
  variant = "default", 
  interactive = false,
  ...props 
}) => {
  const variants = {
    default: "bg-teal-950/40 border-teal-500/30",
    active: "bg-teal-900/40 border-teal-400/50 shadow-[0_0_30px_-10px_rgba(45,212,191,0.3)]",
    danger: "bg-red-950/40 border-red-500/30",
    ghost: "bg-white/5 border-white/10 hover:bg-white/10",
  };

  const Component = interactive ? motion.div : "div";

  return (
    <Component
      className={cn(
        "relative overflow-hidden rounded-3xl backdrop-blur-xl border p-6 transition-all duration-300",
        variants[variant],
        interactive && "cursor-pointer hover:-translate-y-1 hover:shadow-2xl hover:shadow-teal-900/20",
        className
      )}
      {...props}
    >
      {/* Subtle Noise Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </Component>
  );
};
