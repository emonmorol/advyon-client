import React from 'react';

/**
 * WBS-TD-CQ-02 — Reusable skeleton loader with variants.
 * Variants: 'card', 'table', 'viewer', 'list'
 */

const VARIANTS = {
    card: () => (
        <div className="animate-pulse space-y-3 p-4 bg-card rounded-lg border border-border">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted/60 rounded w-full" />
            <div className="h-3 bg-muted/60 rounded w-5/6" />
            <div className="h-8 bg-muted rounded w-1/3 mt-2" />
        </div>
    ),

    table: () => (
        <div className="animate-pulse space-y-2 p-4">
            {/* Header */}
            <div className="flex gap-4 pb-2 border-b border-border">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-3 bg-muted rounded flex-1" />
                ))}
            </div>
            {/* Rows */}
            {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-4 py-2 border-b border-border/50">
                    {[...Array(4)].map((_, j) => (
                        <div key={j} className="h-3 bg-muted/60 rounded flex-1" />
                    ))}
                </div>
            ))}
        </div>
    ),

    viewer: () => (
        <div className="animate-pulse p-8 space-y-4 bg-white rounded-lg shadow-sm" style={{ minHeight: 600 }}>
            <div className="h-6 bg-muted rounded w-1/2 mb-4" />
            {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                    <div className="h-3 bg-muted/60 rounded w-full" />
                    <div className="h-3 bg-muted/60 rounded w-11/12" />
                    <div className="h-3 bg-muted/60 rounded w-10/12" />
                    <div className="h-6" />
                </div>
            ))}
        </div>
    ),

    list: () => (
        <div className="animate-pulse space-y-2">
            {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-border">
                    <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                        <div className="h-3 bg-muted rounded w-3/4" />
                        <div className="h-2 bg-muted/60 rounded w-1/2" />
                    </div>
                </div>
            ))}
        </div>
    ),
};

const LoadingSkeleton = ({ variant = 'card', count = 1, className = '' }) => {
    const VariantComponent = VARIANTS[variant] || VARIANTS.card;

    return (
        <div className={className}>
            {[...Array(count)].map((_, i) => (
                <VariantComponent key={i} />
            ))}
        </div>
    );
};

export default LoadingSkeleton;
