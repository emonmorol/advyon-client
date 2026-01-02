import React from 'react';
import { Search, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import CategoryTabs from './CategoryTabs';

const CommunityFilters = ({ categories, activeCategory, onCategoryChange }) => {
    return (
        <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3.5 top-3 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Search discussions, topics, or keywords..."
                        className="pl-10 h-11 bg-card border-border/60 focus-visible:ring-primary text-base"
                    />
                </div>
                <div className="flex gap-3">
                    <Select defaultValue="newest">
                        <SelectTrigger className="w-[180px] h-11 bg-card border-border/60">
                            <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="popular">Most Popular</SelectItem>
                            <SelectItem value="unanswered">Unanswered</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button variant="outline" size="icon" className="shrink-0 h-11 w-11 border-border/60">
                        <Filter className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <CategoryTabs
                categories={categories}
                active={activeCategory}
                onChange={onCategoryChange}
            />
        </div>
    );
};

export default CommunityFilters;
