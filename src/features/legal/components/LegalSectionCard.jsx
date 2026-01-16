import React from 'react';
import { Book, Bookmark, Share2, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

const LegalSectionCard = ({ section, onClick, onSave }) => {
  return (
    <Card 
      className="group hover:border-primary/50 transition-all duration-200 cursor-pointer overflow-hidden border-border/60"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="flex flex-col md:flex-row">
          {/* Left Indicator */}
          <div className="w-1.5 bg-primary/20 group-hover:bg-primary transition-colors flex-shrink-0" />
          
          <div className="flex-1 p-5 space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 font-normal">
                    {section.actName}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">
                    Year: {section.year}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                  Section {section.number}: {section.title}
                </h3>
              </div>
              
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSave?.(section);
                  }}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    // Share logic
                  }}
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <p className="text-muted-foreground text-sm line-clamp-2 md:line-clamp-3 leading-relaxed">
              {section.previewText}
            </p>

            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Book className="w-3.5 h-3.5" />
                <span>Chapter {section.chapter}</span>
              </div>
              <span className="text-xs font-medium text-primary flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                Read Full Section
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LegalSectionCard;
