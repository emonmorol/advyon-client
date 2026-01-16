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
            <SelectItem value="The Penal Code">The Penal Code</SelectItem>
            <SelectItem value="The Code of Criminal Procedure">CrPC</SelectItem>
            <SelectItem value="The Code of Civil Procedure">CPC</SelectItem>
            <SelectItem value="The Evidence Act">Evidence Act</SelectItem>
            <SelectItem value="Information and Communication Technology Act">ICT Act</SelectItem>
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
            <SelectItem value="2006">2006 (ICT)</SelectItem>
            <SelectItem value="2000">2000 (Nari-O-Shishu)</SelectItem>
            <SelectItem value="1908">1908 (CPC/Limitation)</SelectItem>
            <SelectItem value="1898">1898 (CrPC)</SelectItem>
            <SelectItem value="1872">1872 (Evidence/Contract)</SelectItem>
            <SelectItem value="1860">1860 (Penal Code)</SelectItem>
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
