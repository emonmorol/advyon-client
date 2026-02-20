import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const SectionHeader = ({ 
  title, 
  subtitle, 
  align = "center",
  className 
}) => {
  return (
    <div className={cn(
      "mb-16",
      align === "center" ? "text-center" : "text-left",
      className
    )}>
      <motion.h2 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-4xl font-bold tracking-tight sm:text-5xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-200 via-white to-emerald-200"
      >
        {title}
      </motion.h2>
      
      {subtitle && (
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className={cn(
            "text-xl text-emerald-100/60 leading-relaxed",
            align === "center" ? "mx-auto max-w-3xl" : "max-w-2xl"
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
};
