import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * WBS-TD-CQ-02 — Centred loading spinner with optional message.
 */
const LoadingSpinner = ({ message = 'Loading...', size = 'md', className = '' }) => {
    const sizeMap = {
        sm: { icon: 'h-5 w-5', text: 'text-xs' },
        md: { icon: 'h-8 w-8', text: 'text-sm' },
        lg: { icon: 'h-12 w-12', text: 'text-base' },
    };

    const s = sizeMap[size] || sizeMap.md;

    return (
        <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
            <Loader2 className={`${s.icon} text-primary animate-spin`} />
            {message && <p className={`text-muted-foreground ${s.text}`}>{message}</p>}
        </div>
    );
};

export default LoadingSpinner;
