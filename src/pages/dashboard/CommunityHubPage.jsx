

import React, { useState } from 'react';
import CommunityHeader from '@/features/community/components/CommunityHeader';
import CommunityFilters from '@/features/community/components/CommunityFilters';
import ThreadFeed from '@/features/community/components/ThreadFeed';
import TrendingSidebar from '@/features/community/components/TrendingSidebar';
import mockData from '@/features/community/data/mockData.json';

const CommunityHubPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [isLoading, setIsLoading] = useState(false);

    const handleCategoryChange = (categoryId) => {
        setActiveCategory(categoryId);
        setIsLoading(true);
        // Simulate loading
        setTimeout(() => setIsLoading(false), 500);
    };

    // Filter threads based on active category
    const filteredThreads = activeCategory === 'all'
        ? mockData.threads
        : mockData.threads.filter(t => t.category.toLowerCase().includes(activeCategory) || t.tags.some(tag => tag.toLowerCase().includes(activeCategory)));

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                <CommunityHeader stats={mockData.stats} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                        <div className="sticky top-24">
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
