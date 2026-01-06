import React from 'react';
import { Filter, Calendar, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LegalFilterBar = ({ filters, onFilterChange }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-1">
      <div className="flex items-center gap-2 mr-2 text-sm font-medium text-muted-foreground">
        <Filter className="w-4 h-4" />
        Filters:
      </div>
      
      <div className="w-[180px]">
        <Select 
          value={filters.actType} 
          onValueChange={(val) => onFilterChange('actType', val)}
        >
          <SelectTrigger className="h-9 bg-background">
            <div className="flex items-center gap-2">
              <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
              <SelectValue placeholder="Act Type" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Acts</SelectItem>
            <SelectItem value="criminal">Criminal Law</SelectItem>
            <SelectItem value="civil">Civil Law</SelectItem>
            <SelectItem value="corporate">Corporate Law</SelectItem>
            <SelectItem value="family">Family Law</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="w-[180px]">
        <Select 
          value={filters.year} 
          onValueChange={(val) => onFilterChange('year', val)}
        >
          <SelectTrigger className="h-9 bg-background">
             <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <SelectValue placeholder="Year" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="older">Older</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="ml-auto">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onFilterChange('reset')}
          className="text-muted-foreground hover:text-foreground h-9"
        >
          Reset Filters
        </Button>
      </div>
    </div>
  );
};

export default LegalFilterBar;
