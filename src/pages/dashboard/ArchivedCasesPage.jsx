import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Archive, Search } from 'lucide-react';
import CaseCard from '@/features/workspace/components/CaseCard';
import { useCasesStore } from '@/store/cases';

const ArchivedCasesPage = () => {
    const navigate = useNavigate();
    const { archivedCases, fetchArchivedCases, isLoading } = useCasesStore();
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchArchivedCases();
    }, [fetchArchivedCases]);

    const filteredCases = (archivedCases || []).filter(c =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="h-full w-full flex flex-col bg-background overflow-hidden relative">
            <div className="flex-1 overflow-y-auto p-6 relative z-20 animate-in fade-in zoom-in-95 duration-500">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-6">
                        <button 
                            onClick={() => navigate('/dashboard')}
                            className="p-2 border border-border rounded-lg hover:bg-accent/20 transition-all text-muted-foreground hover:text-foreground"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <Archive size={24} className="text-amber-500" />
                                Archived Cases
                            </h1>
                            <p className="text-muted-foreground text-sm">View or restore cases that are no longer active.</p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
                        <input
                            type="text"
                            placeholder="Search archived cases..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-accent/20 border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                        />
                    </div>

                    {/* Content */}
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCases.map(c => (
                                <CaseCard 
                                    key={c.id || c._id} 
                                    data={c} 
                                    onOpen={(caseData) => navigate(`/dashboard/workspace/${caseData.id || caseData._id}`)} 
                                />
                            ))}

                            {filteredCases.length === 0 && (
                                <div className="col-span-full py-16 flex flex-col items-center justify-center text-center bg-background border border-border border-dashed rounded-xl mt-4">
                                    <Archive size={48} className="text-muted-foreground/30 mb-4" />
                                    <p className="text-foreground font-semibold text-lg">No archived cases found</p>
                                    <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                                        {searchTerm 
                                            ? `No archived cases matching "${searchTerm}"`
                                            : "You don't have any archived cases yet. Active cases that are closed will appear here."}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ArchivedCasesPage;
