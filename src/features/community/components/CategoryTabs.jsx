import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const CategoryTabs = ({ categories, active, onChange }) => {
    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mask-fade-right">
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onChange(category.id)}
                    className={cn(
                        "relative px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                        active === category.id
                            ? "text-primary-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                >
                    {active === category.id && (
                        <motion.div
                            layoutId="activeCategory"
                            className="absolute inset-0 bg-primary rounded-full"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                    )}
                    <span className="relative z-10">{category.label}</span>
                </button>
            ))}
        </div>
    );
};

export default CategoryTabs;
