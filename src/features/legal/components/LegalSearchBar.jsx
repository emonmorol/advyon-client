import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

const LegalSearchBar = ({ 
  value, 
  onSearch, 
  placeholder = "Search for acts, sections, or keywords..." 
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="text"
        className="pl-10 h-12 text-base bg-card shadow-sm border-border/60 focus:ring-primary/20"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};

export default LegalSearchBar;
