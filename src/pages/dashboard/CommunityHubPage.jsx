

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
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    // Use Store
    const { threads, fetchThreads, isLoading, clearCache, communityStats, fetchCommunityStats } = useCommunityStore();

    // Category ID to backend category mapping
    const CATEGORY_MAP = {
        family: 'Family Law',
        criminal: 'Criminal Defense',
        civil: 'Civil Litigation',
        property: 'Property Law',
        corporate: 'Corporate',
        ip: 'Intellectual Property',
        others: 'Others',
    };

    // Debounce search
    React.useEffect(() => {
        const timer = setTimeout(() => {
            const params = {};

            // Add search param
            if (searchTerm) params.searchTerm = searchTerm;

            // Add category param
            if (activeCategory !== 'all') {
                params.category = CATEGORY_MAP[activeCategory];
            }

            // Add sort param
            switch (sortBy) {
                case 'newest':
                    params.sort = '-createdAt';
                    break;
                case 'popular':
                    params.sort = '-upvotesCount';
                    break;
                case 'unanswered':
                    params.repliesCount = 0;
                    break;
                default:
                    params.sort = '-createdAt';
            }

            // Force fetch to bypass cache when filters change
            fetchThreads(params, true);
        }, 500); // 500ms debounce

        return () => clearTimeout(timer);
    }, [fetchThreads, activeCategory, searchTerm, sortBy]);

    // Initial stats fetch
    React.useEffect(() => {
        fetchCommunityStats();
    }, [fetchCommunityStats]);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
    };

    const handleCreateSuccess = (newThread) => {
        // Clear cache and force fresh fetch
        clearCache();
        fetchThreads({}, true);
        fetchCommunityStats(); // Update stats after new thread
        console.log("Thread created successfully:", newThread);
    };

    // Map backend stats to UI expected format
    const displayStats = {
        discussions: communityStats?.totalThreads || 0,
        online: communityStats?.activeUsers || 0
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <CommunityHeader
                    stats={displayStats}
                    onAskQuestion={() => setIsCreateModalOpen(true)}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <CommunityFilters
                            categories={mockData.categories}
                            activeCategory={activeCategory}
                            onCategoryChange={handleCategoryChange}
                            searchTerm={searchTerm}
                            onSearchChange={setSearchTerm}
                            sortBy={sortBy}
                            onSortChange={setSortBy}
                        />
                        <ThreadFeed
                            threads={threads}
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
