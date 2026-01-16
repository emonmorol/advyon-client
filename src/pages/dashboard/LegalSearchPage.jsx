import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Scale, BookOpen, Loader2 } from 'lucide-react';
import LegalSearchBar from '@/features/legal/components/LegalSearchBar';
import LegalFilterBar from '@/features/legal/components/LegalFilterBar';
import LegalSectionCard from '@/features/legal/components/LegalSectionCard';
import LegalSectionModal from '@/features/legal/components/LegalSectionModal';
import Pagination from '@/components/ui/Pagination';
import useLegalStore from '@/store/legal';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const LegalSearchPage = () => {
  const { legals, meta, isLoading, fetchLegals, error } = useLegalStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [filters, setFilters] = useState({ actType: 'all', year: 'all' });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchLegals({
      search: debouncedSearchQuery,
      actName: filters.actType,
      year: filters.year,
      page: currentPage,
      limit: 10
    });
  }, [debouncedSearchQuery, filters, currentPage, fetchLegals]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({ actType: 'all', year: 'all' });
      setSearchQuery('');
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
    setCurrentPage(1);
  };

  const handleCardClick = (section) => {
    setSelectedSection(section);
    setIsOpen(true);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header / Hero Section */}
      <div className="pt-8 pb-12 px-4 md:px-8 bg-gradient-to-b from-primary/5 to-transparent border-b border-border/40">
        <div className="max-w-4xl mx-auto space-y-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium"
          >
            <Scale className="w-4 h-4" />
            ADVYON Legal Database
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-foreground"
          >
            Search Acts & Sections
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto"
          >
            Access the comprehensive database of Bangladeshi laws, acts, and legal precedents.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl mx-auto space-y-4 pt-4"
          >
            <LegalSearchBar
              value={searchQuery}
              onSearch={handleSearch}
            />
            <LegalFilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <div className="flex items-center justify-between pb-4 border-b border-border/50">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            Search Results
            {!isLoading && (
              <span className="ml-2 text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                {meta.total} found
              </span>
            )}
          </h2>
          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPage}
            onPageChange={handlePageChange}
          />
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-muted-foreground">Searching legal database...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 space-y-4">
            <p className="text-destructive text-lg font-medium">{error}</p>
            <button
              onClick={() => fetchLegals({
                search: searchQuery,
                actName: filters.actType,
                year: filters.year,
                page: currentPage,
                limit: 10
              })}
              className="text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        ) : legals.length > 0 ? (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-4"
          >
            {legals.map((section) => (
              <motion.div key={section._id} variants={item}>
                <LegalSectionCard
                  section={section}
                  onClick={() => handleCardClick(section)}
                  onSave={() => console.log('Saved', section._id)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No laws or sections found matching your criteria.</p>
            <button
              onClick={() => handleFilterChange('reset')}
              className="text-primary hover:underline mt-2"
            >
              Reset all filters
            </button>
          </div>
        )}

        {meta.totalPage > 1 && !isLoading && (
          <div className="flex justify-center pt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={meta.totalPage}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>

      <LegalSectionModal
        section={selectedSection}
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default LegalSearchPage;
