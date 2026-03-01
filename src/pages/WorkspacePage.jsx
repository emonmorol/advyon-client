import React, { useState, useEffect, useMemo } from 'react';
import { DashboardView, WorkspaceView } from '../features/workspace';
import { useCasesStore } from '@/store/cases';
import { useParams } from 'react-router-dom';

const WorkspacePage = () => {
    const { caseId } = useParams(); // Get caseId from URL
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'workspace'
    const [activeCase, setActiveCase] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Global search state

    const { cases, fetchCases } = useCasesStore();

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    const routeSelectedCase = useMemo(() => {
        if (!caseId || cases.length === 0) {
            return null;
        }
        return cases.find(c => c.id === caseId || c._id === caseId) || null;
    }, [caseId, cases]);

    const effectiveCurrentView = routeSelectedCase ? 'workspace' : currentView;
    const effectiveActiveCase = routeSelectedCase || activeCase || cases[0] || null;

    const handleCaseSelect = (caseData) => {
        setActiveCase(caseData);
        setCurrentView('workspace');
        setSearchTerm(''); // Clear search when switching context
    };

    return (
        <div className="h-full w-full flex flex-col bg-background overflow-hidden relative">
            {effectiveCurrentView === 'dashboard' ? (
                <DashboardView onSelectCase={handleCaseSelect} searchTerm={searchTerm} />
            ) : (
                <WorkspaceView
                    activeCase={effectiveActiveCase}
                    onSwitchCase={handleCaseSelect}
                    onBack={() => setCurrentView('dashboard')}
                    searchTerm={searchTerm}
                />
            )}
        </div>
    );
};

export default WorkspacePage;
