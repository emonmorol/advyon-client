import React from 'react';
import { Copy, Quote, Bookmark, BookOpen, ExternalLink, Loader2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";

import useLegalStore from '@/store/legal';

const LegalSectionModal = ({ section, isOpen, onClose }) => {
   const { fetchSectionByNumber } = useLegalStore();
   const [currentSection, setCurrentSection] = React.useState(section);
   const [isLoadingRelated, setIsLoadingRelated] = React.useState(false);
   const [error, setError] = React.useState(null);
   const [copied, setCopied] = React.useState(false);

   React.useEffect(() => {
      setCurrentSection(section);
      setError(null);
   }, [section]);

   if (!currentSection) return null;

   const handleRelatedSectionClick = async (number) => {
      setIsLoadingRelated(true);
      setError(null);
      try {
         const targetSection = await fetchSectionByNumber(currentSection.actName, number);
         if (targetSection) {
            setCurrentSection(targetSection);
         } else {
            setError(`Section ${number} not found in ${currentSection.actName}`);
         }
      } catch (err) {
         setError(`Failed to load Section ${number}`);
      } finally {
         setIsLoadingRelated(false);
      }
   };

   const handleCopy = async () => {
      try {
         const textToCopy = `${currentSection.actName} (Act ${currentSection.year})\n` +
            `Section ${currentSection.number}: ${currentSection.title}\n\n` +
            `Chapter ${currentSection.chapter}: ${currentSection.chapterTitle}\n\n` +
            `${currentSection.fullText}`;
         
         await navigator.clipboard.writeText(textToCopy);
         setCopied(true);
         setTimeout(() => setCopied(false), 2000);
      } catch (err) {
         console.error('Failed to copy:', err);
         setError('Failed to copy to clipboard');
         setTimeout(() => setError(null), 3000);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-3xl max-h-[85vh] p-0 overflow-hidden flex flex-col gap-0 border-border/80 shadow-2xl">
            {/* Header */}
            <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
               <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                     <Badge className="bg-primary/90 hover:bg-primary">{currentSection.actName}</Badge>
                     <span className="text-sm text-muted-foreground font-mono">Act {currentSection.year}</span>
                  </div>
                  <DialogTitle className="text-xl leading-tight">
                     Section {currentSection.number}: {currentSection.title}
                  </DialogTitle>
               </div>
            </DialogHeader>

            {/* Content */}
            <ScrollArea className="flex-1 p-6 sm:p-8">
               {error && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg text-destructive text-sm">
                     {error}
                  </div>
               )}
               
               {isLoadingRelated ? (
                  <div className="flex flex-col items-center justify-center py-20 gap-2">
                     <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                     <p className="text-muted-foreground text-sm">Loading section...</p>
                  </div>
               ) : (
                  <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-foreground leading-loose">
                     <div className="p-4 bg-muted/20 rounded-lg border border-border/50 text-sm font-medium text-muted-foreground mb-6">
                        Chapter {currentSection.chapter}: {currentSection.chapterTitle}
                     </div>
                     {/* Simulating formatted legal text */}
                     {currentSection.fullText.split('\n').map((para, i) => (
                        <p key={i} className="mb-4">{para}</p>
                     ))}

                     {currentSection.subsections && currentSection.subsections.length > 0 && (
                        <div className="mt-8 space-y-4">
                           <h4 className="font-semibold text-lg text-foreground border-b border-border pb-2">Sub-sections</h4>
                           <ul className="space-y-3 list-none pl-0">
                              {currentSection.subsections.map((sub, idx) => (
                                 <li key={idx} className="flex gap-3 text-sm">
                                    <span className="font-mono font-medium text-muted-foreground min-w-[24px]">({idx + 1})</span>
                                    <span className="text-foreground/90">{sub}</span>
                                 </li>
                              ))}
                           </ul>
                        </div>
                     )}
                  </div>
               )}

               {currentSection.relatedSections && currentSection.relatedSections.length > 0 && (
                  <div className="mt-10 pt-6 border-t border-border">
                     <h4 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">Related Sections</h4>
                     <div className="flex flex-wrap gap-2">
                        {currentSection.relatedSections.map((rel, i) => (
                           <Button
                              key={i}
                              variant="outline"
                              size="sm"
                              className="h-8 text-xs gap-1.5 hover:bg-primary/5 hover:border-primary/30"
                              onClick={() => handleRelatedSectionClick(rel)}
                              disabled={isLoadingRelated}
                           >
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
                  <Button 
                     variant="outline" 
                     size="sm" 
                     className="gap-2 hover:bg-primary/5 hover:text-primary hover:border-primary/30"
                     onClick={handleCopy}
                     disabled={copied}
                  >
                     {copied ? (
                        <>
                           <Check className="w-4 h-4 text-green-500" />
                           Copied!
                        </>
                     ) : (
                        <>
                           <Copy className="w-4 h-4" />
                           Copy
                        </>
                     )}
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
