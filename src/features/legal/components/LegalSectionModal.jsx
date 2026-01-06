import React from 'react';
import { Copy, Quote, Bookmark, X, BookOpen, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const LegalSectionModal = ({ section, isOpen, onClose }) => {
  if (!section) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden flex flex-col gap-0 border-border/80 shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border bg-muted/30 flex items-start justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-primary/90 hover:bg-primary">{section.actName}</Badge>
              <span className="text-sm text-muted-foreground font-mono">Act {section.year}</span>
            </div>
            <DialogTitle className="text-xl leading-tight">
              Section {section.number}: {section.title}
            </DialogTitle>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose} 
            className="flex-shrink-0 -mr-2"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <ScrollArea className="flex-1 p-6 sm:p-8">
          <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground leading-loose">
             <div className="p-4 bg-muted/20 rounded-lg border border-border/50 text-sm font-medium text-muted-foreground mb-6">
                Chapter {section.chapter}: {section.chapterTitle}
             </div>
             {/* Simulating formatted legal text */}
             {section.fullText.split('\n').map((para, i) => (
                <p key={i} className="mb-4">{para}</p>
             ))}
             
             {section.subsections && section.subsections.length > 0 && (
                <div className="mt-8 space-y-4">
                   <h4 className="font-semibold text-lg text-foreground border-b border-border pb-2">Sub-sections</h4>
                   <ul className="space-y-3 list-none pl-0">
                      {section.subsections.map((sub, idx) => (
                         <li key={idx} className="flex gap-3 text-sm">
                            <span className="font-mono font-medium text-muted-foreground min-w-[24px]">({idx + 1})</span>
                            <span className="text-foreground/90">{sub}</span>
                         </li>
                      ))}
                   </ul>
                </div>
             )}
          </div>
          
          {section.relatedSections && (
             <div className="mt-10 pt-6 border-t border-border">
                <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Related Sections</h4>
                <div className="flex flex-wrap gap-2">
                   {section.relatedSections.map((rel, i) => (
                      <Button key={i} variant="outline" size="sm" className="h-8 text-xs gap-1.5">
                         <BookOpen className="w-3.5 h-3.5 text-primary" />
                         Section {rel}
                      </Button>
                   ))}
                </div>
             </div>
          )}
        </ScrollArea>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border bg-background flex items-center justify-between gap-4">
           <Button variant="outline" size="sm" className="gap-2">
              <ExternalLink className="w-4 h-4" />
              View Original Source
           </Button>
           
           <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                 <Copy className="w-4 h-4" />
                 Copy
              </Button>
              <Button variant="outline" size="sm" className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30">
                 <Quote className="w-4 h-4" />
                 Cite
              </Button>
              <Button size="sm" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
                 <Bookmark className="w-4 h-4" />
                 Save Section
              </Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LegalSectionModal;
