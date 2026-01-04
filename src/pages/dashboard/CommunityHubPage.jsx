

import React, { useState } from 'react';
import CommunityHeader from '@/features/community/components/CommunityHeader';
import CommunityFilters from '@/features/community/components/CommunityFilters';
import ThreadFeed from '@/features/community/components/ThreadFeed';
import TrendingSidebar from '@/features/community/components/TrendingSidebar';
import CreateThreadModal from '@/features/community/components/CreateThreadModal';
import mockData from '@/features/community/data/mockData.json';
import { useCommunityStore } from '@/store/useCommunityStore';

const CommunityHubPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    
    // Use Store
    const { threads, fetchThreads, isLoading } = useCommunityStore();

    React.useEffect(() => {
        fetchThreads();
    }, [fetchThreads]);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        // Store handles caching/loading
    };

    const handleCreateSuccess = (newThread) => {
        // Option: re-fetch or manual add to store
        fetchThreads(); 
        console.log("Thread created successfully:", newThread);
    };

    // Filter threads based on active category
    const filteredThreads = activeCategory === 'all'
        ? threads
        : threads.filter(t => t.category?.toLowerCase().includes(activeCategory) || t.tags?.some(tag => tag.toLowerCase().includes(activeCategory)));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <CommunityHeader
                    stats={mockData.stats}
                    onAskQuestion={() => setIsCreateModalOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <CommunityFilters
                            categories={mockData.categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryChange}
                        />
                        <ThreadFeed
                            threads={filteredThreads}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="sticky top-24 space-y-6">
                            <TrendingSidebar
                                contributors={mockData.topContributors}
                                tags={mockData.popularTags}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {isCreateModalOpen && (
                <CreateThreadModal
                    onClose={() => setIsCreateModalOpen(false)}
                    onSuccess={handleCreateSuccess}
                    categories={mockData.categories}
                />
            )}
        </div>
    );
};

export default CommunityHubPage;
