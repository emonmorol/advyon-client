import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Search, Clock } from 'lucide-react';
import CaseCard from './CaseCard';
import { useCasesStore } from '@/store/cases';
import { useActivityStore } from '@/store/useActivityStore';
import { useAuthStore } from '@/store/useAuthStore';

const formatRelativeTime = (date) => {
    if (!date) return 'Just now';

    const now = new Date();
    const activityDate = new Date(date);
    const diffMs = now - activityDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return activityDate.toLocaleDateString();
};

const DashboardView = ({ onSelectCase, searchTerm }) => {
    const navigate = useNavigate();
    const { user } = useAuthStore();

    // Use Store
    const { cases, fetchCases } = useCasesStore();
    const {
        activities,
        fetchRecentActivities,
        isLoading: activitiesLoading,
    } = useActivityStore();


    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    useEffect(() => {
        fetchRecentActivities(6);

        const refreshTimer = setInterval(() => {
            fetchRecentActivities(6);
        }, 30000);

        return () => clearInterval(refreshTimer);
    }, [fetchRecentActivities]);

    const activeCases = useMemo(
        () => (cases || []).filter((c) => (c.status || '').toLowerCase() !== 'archived'),
        [cases],
    );

    // Filter cases based on search term (client-side filtering for now)
    const filteredCases = activeCases.filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto p-6 relative z-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-background-foreground mb-1">Welcome back, <span className='text-accent'>{user?.displayName || user?.fullName || 'Counsel'}</span></h1>
                        <p className="text-muted-foreground text-sm">Here is what's happening across your active cases today.</p>
                    </div>
                    <button
                        className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-accent-foreground px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-lg"
                        onClick={() => navigate('/dashboard/cases/new')}
                    >
                        <Plus size={16} /> New Case
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                    {/* Main Grid - Cases */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-semibold text-background-foreground flex items-center gap-2">
                                <Briefcase size={16} />
                                {searchTerm ? `Results for "${searchTerm}"` : "Active Cases"}
                            </h2>
                            <button
                                className="text-xs text-amber-500 hover:text-amber-700 hover:font-bold transition-all"
                                onClick={() => navigate('/dashboard/cases/archived')}
                            >
                                View Archived
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredCases.map(c => (
                                <CaseCard key={c.id} data={c} onOpen={onSelectCase} />
                            ))}

                            {filteredCases.length === 0 && (
                                <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center bg-background border border-teal-accent/30 border-dashed rounded-xl">
                                    <Search size={40} className="text-amber-500/70 mb-3" />
                                    <p className="text-amber-500 font-semibold">No cases found</p>
                                    <p className="text-sm text-muted-foreground mt-1">Try adjusting your search for "{searchTerm}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Sidebar - Global Feed */}
                    <div className="space-y-4">
                        <div className="bg-accent/20 border border-accent/20 rounded-xl p-4 shadow-sm">
                            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Clock size={12} className="text-teal-accent" /> Recent Activity
                            </h2>
                            {activitiesLoading ? (
                                <div className="text-xs text-muted-foreground py-4">Loading recent activity...</div>
                            ) : activities.length > 0 ? (
                                <div className="space-y-3">
                                    {activities.map((activity) => (
                                        <div key={activity._id} className="relative pl-3 border-l-2 border-accent/30">
                                            <div className="absolute -left-1 top-1 w-2 h-2 bg-background border border-accent rounded-full"></div>
                                            <p className="text-sm text-foreground font-medium">{activity.message || 'Activity logged'}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {activity.caseId?.caseNumber || activity.caseId?.title || 'General activity'}
                                            </p>
                                            <p className="text-[10px] text-muted-foreground/70">{formatRelativeTime(activity.createdAt)}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-xs text-muted-foreground py-3">No recent activity found.</div>
                            )}
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default DashboardView;
