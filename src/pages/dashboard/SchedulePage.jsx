import React from 'react';
import { Navigate } from 'react-router-dom';

/**
 * SchedulePage - Helper to redirect to calendar view or list
 * Since we don't have a full calendar page yet, we redirect to 'workspace' 
 * or show a placeholder. For Phase 1, we focus on creation.
 */
const SchedulePage = () => {
    // For now, redirect to dashboard or show a "Coming Soon" for the full calendar
    // Gap G5 was "Schedule Creation Form", which is at /schedule/new
    return (
        <div className="p-8 text-center">
             <h1 className="text-2xl font-bold mb-4">Calendar & Schedule</h1>
             <p className="text-muted-foreground mb-6">Full calendar view is coming in Phase 1.5.</p>
             <div className="flex justify-center gap-4">
                 <a href="/dashboard/schedule/new" className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                     Schedule New Event
                 </a>
                 <a href="/dashboard" className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80">
                     Back to Dashboard
                 </a>
             </div>
        </div>
    );
};

export default SchedulePage;
