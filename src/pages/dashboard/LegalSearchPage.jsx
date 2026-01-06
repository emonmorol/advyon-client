import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, BookOpen } from 'lucide-react';
import LegalSearchBar from '@/features/legal/components/LegalSearchBar';
import LegalFilterBar from '@/features/legal/components/LegalFilterBar';
import LegalSectionCard from '@/features/legal/components/LegalSectionCard';
import LegalSectionModal from '@/features/legal/components/LegalSectionModal';
import Pagination from '@/components/ui/Pagination';

// Mock Data
const MOCK_RESULTS = [
  {
    id: 1,
    actName: 'Indian Penal Code',
    year: '1860',
    number: '302',
    title: 'Punishment for murder',
    chapter: 'XVI',
    chapterTitle: 'Of Offences Affecting the Human Body',
    previewText: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.',
    fullText: 'Whoever commits murder shall be punished with death, or imprisonment for life, and shall also be liable to fine.\n\nExplanation.—The punishment for murder is either death or imprisonment for life, and fine. The nature of the punishment depends on the gravity of the offence.',
    subsections: [
       'If the murder is committed with premeditation, the punishment may be more severe.',
       'The court has discretion to decide the quantum of punishment based on the facts of the case.'
    ],
    relatedSections: ['300', '304', '307']
  },
  {
    id: 2,
    actName: 'Information Technology Act',
    year: '2000',
    number: '66F',
    title: 'Punishment for cyber terrorism',
    chapter: 'XI',
    chapterTitle: 'Offences',
    previewText: 'Whoever with intent to threaten the unity, integrity, security or sovereignty of India or to strike terror in the people...',
    fullText: '(1) Whoever shows any information or data which is considered as cyber terrorism...\n(2) Whoever commits or conspires to commit cyber terrorism shall be punishable with imprisonment which may extend to imprisonment for life.',
    subsections: [],
    relatedSections: ['66', '67']
  },
  {
    id: 3,
    actName: 'Code of Criminal Procedure',
    year: '1973',
    number: '41',
    title: 'When police may arrest without warrant',
    chapter: 'V',
    chapterTitle: 'Arrest of Persons',
    previewText: 'Any police officer may without an order from a Magistrate and without a warrant, arrest any person who has been concerned in any cognizable offence...',
    fullText: 'Any police officer may without an order from a Magistrate and without a warrant, arrest any person who has been concerned in any cognizable offence, or against whom a reasonable complaint has been made, or credible information has been received, or a reasonable suspicion exists, of his having been so concerned.',
    subsections: [
        'Who has been proclaimed as an offender either under this Code or by order of the State Government;',
        'Who is in possession of any implement of house-breaking without lawful excuse;'
    ],
    relatedSections: ['42', '46', '50']
  },
  {
    id: 4,
    actName: 'Indian Contract Act',
    year: '1872',
    number: '10',
    title: 'What agreements are contracts',
    chapter: 'II',
    chapterTitle: 'Of Contracts, Voidable Contracts and Void Agreements',
    previewText: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object...',
    fullText: 'All agreements are contracts if they are made by the free consent of parties competent to contract, for a lawful consideration and with a lawful object, and are not hereby expressly declared to be void.',
     subsections: [],
    relatedSections: ['11', '12', '13']
  }
];

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
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ actType: 'all', year: 'all' });
  const [isOpen, setIsOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const handleSearch = (query) => {
    setSearchQuery(query);
    // Simulate API search
  };

  const handleFilterChange = (key, value) => {
    if (key === 'reset') {
      setFilters({ actType: 'all', year: 'all' });
    } else {
      setFilters(prev => ({ ...prev, [key]: value }));
    }
  };

  const handleCardClick = (section) => {
    setSelectedSection(section);
    setIsOpen(true);
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
            Access the comprehensive database of Indian laws, acts, and legal precedents.
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
              <span className="ml-2 text-sm font-normal text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                 {MOCK_RESULTS.length * 15} found
              </span>
           </h2>
           <Pagination 
             currentPage={currentPage}
             totalPages={12}
             onPageChange={setCurrentPage}
           />
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-4"
        >
          {MOCK_RESULTS.map((section) => (
            <motion.div key={section.id} variants={item}>
              <LegalSectionCard 
                section={section}
                onClick={() => handleCardClick(section)}
                onSave={() => console.log('Saved', section.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="flex justify-center pt-8">
           <Pagination 
             currentPage={currentPage}
             totalPages={12}
             onPageChange={setCurrentPage}
           />
        </div>
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
