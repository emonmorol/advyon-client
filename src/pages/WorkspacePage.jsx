import React, { useState, useEffect } from 'react';
import { DashboardView, WorkspaceView } from '../features/workspace';
import { Navbar } from '@/components/Navbar';
import { Sidebar } from '@/components/Sidebar';
import { motion } from 'framer-motion';
import { useCasesStore } from '@/store/cases';
import { useParams } from 'react-router-dom';

const WorkspacePage = () => {
    const { caseId } = useParams(); // Get caseId from URL
    const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' or 'workspace'
    const [activeCase, setActiveCase] = useState(null);
    const [searchTerm, setSearchTerm] = useState(''); // Global search state
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true);

    const { cases, fetchCases, isLoading } = useCasesStore();

    useEffect(() => {
        fetchCases();
    }, [fetchCases]);

    // Handle URL parameter for direct case access
    useEffect(() => {
        if (caseId && cases.length > 0) {
            // Find the case with matching ID (check both id and _id)
            const caseToOpen = cases.find(c => c.id === caseId || c._id === caseId);
            if (caseToOpen) {
                setActiveCase(caseToOpen);
                setCurrentView('workspace');
            }
        }
    }, [caseId, cases]);

    const handleCaseSelect = (caseData) => {
        setActiveCase(caseData);
        setCurrentView('workspace');
        setSearchTerm(''); // Clear search when switching context
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">

            <div className="flex flex-1 relative">
                {/* Animated Placeholder for the fixed sidebar width */}


                <Sidebar
                    className="hidden md:flex bg-primary"
                    isCollapsed={isSidebarCollapsed}
                    onMouseEnter={() => setIsSidebarCollapsed(false)}
                    onMouseLeave={() => setIsSidebarCollapsed(true)}
                />

                {/* Workspace Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {currentView === 'dashboard' ? (
                        <DashboardView onSelectCase={handleCaseSelect} searchTerm={searchTerm} />
                    ) : (
                        <WorkspaceView
                            activeCase={activeCase || cases[0]}
                            onSwitchCase={handleCaseSelect}
                            onBack={() => setCurrentView('dashboard')}
                            searchTerm={searchTerm}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default WorkspacePage;
