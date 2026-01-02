import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Briefcase, Search, Clock } from 'lucide-react';
import CaseCard from './CaseCard';
import { RECENT_ACTIVITY } from '../mockData';
import { useCasesStore } from '@/store/cases';

const DashboardView = ({ onSelectCase, searchTerm }) => {
    const navigate = useNavigate();

    // Use Store
    const { cases, fetchCases, isLoading } = useCasesStore();


    useEffect(() => {
        fetchCases();
    }, [fetchCases]);
    console.log(cases)

    // Filter cases based on search term (client-side filtering for now)
    const filteredCases = (cases || []).filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ref?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.type?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 overflow-y-auto p-6 relative z-20 animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-background-foreground mb-1">Welcome back, <span className='text-accent'>John</span></h1>
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
                            <button className="text-xs text-accent hover:text-primary-foreground transition-colors">View Archived</button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredCases.map(c => (
                                <CaseCard key={c.id} data={c} onOpen={onSelectCase} />
                            ))}

                            {filteredCases.length === 0 && (
                                <div className="col-span-2 py-10 flex flex-col items-center justify-center text-center bg-background border border-teal-accent/30 border-dashed rounded-xl">
                                    <Search size={40} className="text-teal-accent/50 mb-3" />
                                    <p className="text-primary-foreground font-medium">No cases found</p>
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
                            <div className="space-y-3">
                                {RECENT_ACTIVITY.map((activity) => (
                                    <div key={activity.id} className="relative pl-3 border-l-2 border-accent/30">
                                        <div className="absolute -left-1 top-1 w-2 h-2 bg-background border border-accent rounded-full"></div>
                                        <p className="text-sm text-foreground font-medium">{activity.action}</p>
                                        <p className="text-xs text-muted-foreground">{activity.case}</p>
                                        <p className="text-[10px] text-muted-foreground/70">{activity.user} • {activity.time}</p>
                                    </div>
                                ))}
                            </div>
                            <button className="w-full mt-3 py-1.5 text-xs text-center text-muted-foreground hover:text-accent-foreground border border-accent/20 rounded hover:bg-accent transition-colors">
                                View All Notifications
                            </button>
                        </div>

                        <div className="bg-accent/20 border border-accent/20 rounded-xl p-4 shadow-sm">
                            <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Daily Summary</h2>
                            <div className="text-xl font-bold text-foreground mb-1">3 Deadlines</div>
                            <p className="text-xs text-muted-foreground mb-2">You have 3 critical deadlines approaching in the next 48 hours.</p>
                            <div className="h-1.5 w-full bg-primary rounded-full overflow-hidden">
                                <div className="h-full bg-accent w-3/4"></div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default DashboardView;
