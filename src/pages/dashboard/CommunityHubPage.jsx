
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CommunityHeader from '@/features/community/components/CommunityHeader';
import CommunityFilters from '@/features/community/components/CommunityFilters';
import ThreadFeed from '@/features/community/components/ThreadFeed';
import TrendingSidebar from '@/features/community/components/TrendingSidebar';
import mockData from '@/features/community/data/mockData.json';
import { useCommunityStore } from '@/store/useCommunityStore';

const CommunityHubPage = () => {
    const navigate = useNavigate();
    const [activeCategory, setActiveCategory] = useState({ id: 'all', label: 'All Topics' });
    
    // Use Store
    const { threads, fetchThreads, isLoading, meta } = useCommunityStore();

    React.useEffect(() => {
        // Fetch threads when category changes
        const params = {};
        if (activeCategory.id !== 'all') {
            params.category = activeCategory.label;
        }
        fetchThreads(params);
    }, [fetchThreads, activeCategory]);

    const handleCategoryChange = (categoryId) => {
        const category = mockData.categories.find(c => c.id === categoryId) || { id: 'all', label: 'All Topics' };
        setActiveCategory(category);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
                <CommunityHeader
                    stats={mockData.stats}
                    onAskQuestion={() => navigate('/dashboard/community/ask')}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">
                        <CommunityFilters
                            categories={mockData.categories}
                            activeCategory={activeCategory.id}
                            onCategoryChange={handleCategoryChange}
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
        </div>
    );
};

export default CommunityHubPage;
