import React from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const StatusTimeline = ({ steps, currentStep }) => {
    return (
        <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-border before:to-transparent">
            {steps.map((step, index) => {
                const isCompleted = index < currentStep;
                const isCurrent = index === currentStep;

                return (
                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                        {/* Icon */}
                        <div className={cn(
                            "flex items-center justify-center w-10 h-10 rounded-full border-2 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300",
                            isCompleted ? "bg-primary border-primary text-primary-foreground" :
                                isCurrent ? "bg-background border-accent text-accent" :
                                    "bg-background border-muted text-muted-foreground"
                        )}>
                            {isCompleted ? <Check className="w-5 h-5" /> :
                                isCurrent ? <Clock className="w-5 h-5 animate-pulse" /> :
                                    <span className="text-sm font-medium">{index + 1}</span>}
                        </div>

                        {/* Content */}
                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-border bg-card shadow-sm">
                            <div className="flex items-center justify-between space-x-2 mb-1">
                                <div className="font-bold text-foreground">{step.title}</div>
                                <time className="font-mono text-xs text-muted-foreground">{step.date}</time>
                            </div>
                            <div className="text-sm text-muted-foreground">
                                {step.description}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default StatusTimeline;
