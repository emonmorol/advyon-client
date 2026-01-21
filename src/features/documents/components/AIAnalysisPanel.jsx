import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import KeyPointsList from './KeyPointsList';
import SummaryContent from './SummaryContent';
import { EntityLegend } from './EntityHighlight';
import { 
  FileText, 
  List, 
  Users, 
  Scale, 
  Sparkles,
  Copy,
  Download,
  RefreshCw,
  User,
  Calendar,
  DollarSign,
  Building,
  MapPin,
  BookOpen
} from 'lucide-react';

/**
 * AIAnalysisPanel - Resizable side panel with tabbed AI insights
 * @param {string} documentId - ID of the current document
 * @param {object} analysis - AI analysis data
 */
const AIAnalysisPanel = ({ 
  documentId, 
  analysis = {} 
}) => {
  // Use analysis data from props, with safe defaults
  const {
    refinedSummary = '',
    rawSummary = '',
    keyPoints = [],
    entities = [],
    legalRefs = []
  } = analysis;

  const getEntityIcon = (type) => {
    switch (type) {
      case 'person': return User;
      case 'organization': return Building;
      case 'date': return Calendar;
      case 'amount': return DollarSign;
      case 'location': return MapPin;
      default: return FileText;
    }
  };

  const getEntityColor = (type) => {
    switch (type) {
      case 'person': return 'text-blue-500 bg-blue-500/10';
      case 'organization': return 'text-amber-500 bg-amber-500/10';
      case 'date': return 'text-purple-500 bg-purple-500/10';
      case 'amount': return 'text-emerald-500 bg-emerald-500/10';
      case 'location': return 'text-rose-500 bg-rose-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  return (
    <div className="h-full flex flex-col bg-card rounded-lg border border-border overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border gradient-teal-depth">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-accent" />
          <h2 className="font-semibold text-primary-foreground">AI Analysis</h2>
        </div>
        <div className="flex items-center gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10"
            title="Refresh analysis"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Tabs Container */}
      <Tabs defaultValue="summary" className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="w-full justify-start rounded-none border-b border-border bg-muted/50 p-0 h-auto">
          <TabsTrigger 
            value="summary" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-2.5 text-xs"
          >
            <FileText className="h-3.5 w-3.5 mr-1.5" />
            Summary
          </TabsTrigger>
          <TabsTrigger 
            value="keypoints" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-2.5 text-xs"
          >
            <List className="h-3.5 w-3.5 mr-1.5" />
            Key Points
          </TabsTrigger>
          <TabsTrigger 
            value="entities" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-2.5 text-xs"
          >
            <Users className="h-3.5 w-3.5 mr-1.5" />
            Entities
          </TabsTrigger>
          <TabsTrigger 
            value="legal" 
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-2.5 text-xs"
          >
            <Scale className="h-3.5 w-3.5 mr-1.5" />
            Legal Refs
          </TabsTrigger>
        </TabsList>

        {/* Summary Tab - Now with Raw/Refined Subviews */}
        <TabsContent value="summary" className="flex-1 overflow-auto custom-scrollbar m-0 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <SummaryContent 
              documentId={documentId}
              rawSummary={rawSummary}
              refinedSummary={refinedSummary}
              onRawChange={(content, timestamp) => console.log('Raw summary saved:', content, timestamp)}
              onRefinedChange={(content, timestamp) => console.log('Refined summary saved:', content, timestamp)}
              onRegenerateFromRaw={async (rawText) => {
                // In real implementation, call AI service here
                console.log('Regenerating from raw text:', rawText.substring(0, 100) + '...');
                return null; // Return null to use mock regeneration
              }}
            />
          </motion.div>
        </TabsContent>

        {/* Key Points Tab */}
        <TabsContent value="keypoints" className="flex-1 overflow-auto custom-scrollbar m-0 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {keyPoints.length} Key Points Identified
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" title="Download key points">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
            <KeyPointsList points={keyPoints} />
          </motion.div>
        </TabsContent>

        {/* Entities Tab */}
        <TabsContent value="entities" className="flex-1 overflow-auto custom-scrollbar m-0 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {entities.length} Entities Found
              </span>
            </div>
            
            {/* EntityLegend /> - Legend implies map/chart, maybe less useful here? keeping simple */}
            
            {['person', 'organization', 'date', 'amount', 'location', 'other'].map(type => {
              const typeEntities = entities.filter(e => (e.type || 'other').toLowerCase() === type);
              if (!typeEntities.length) return null;
              
              const IconComponent = getEntityIcon(type);
              const colorClass = getEntityColor(type);
              
              return (
                <div key={type} className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase text-muted-foreground flex items-center gap-1.5">
                    <IconComponent className="h-3 w-3" />
                    {type}s
                  </h3>
                  <div className="space-y-1">
                    {typeEntities.map((entity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.02 }}
                        className="flex items-center justify-between p-2.5 rounded-md border border-transparent hover:border-border hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full ${colorClass.split(' ')[0]}`} />
                          <span className="text-sm font-medium text-foreground">{entity.name}</span>
                        </div>
                        {entity.count > 1 && (
                          <span className="text-[10px] font-medium text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full">
                            {entity.count} matches
                          </span>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            {entities.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                    No entities detected in this document.
                </div>
            )}
          </motion.div>
        </TabsContent>

        {/* Legal References Tab */}
        <TabsContent value="legal" className="flex-1 overflow-auto custom-scrollbar m-0 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Legal References & Citations
              </span>
            </div>
            
            <div className="space-y-3">
              {legalRefs.length > 0 ? legalRefs.map((ref, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-3 rounded-lg border border-border bg-card/50 hover:bg-card hover:border-accent/30 transition-all shadow-sm group"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 p-1.5 rounded bg-primary/5 text-primary group-hover:bg-primary/10 transition-colors">
                      <Scale className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                        {typeof ref === 'string' ? (
                             <p className="text-sm font-medium text-foreground leading-relaxed">{ref}</p>
                        ) : (
                            <>
                              <div className="flex items-center gap-2 mb-1.5">
                                <span className="font-semibold text-sm text-foreground">{ref.citation || ref.text}</span>
                                {ref.relevance && (
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${
                                    ref.relevance === 'high' 
                                      ? 'bg-red-500/10 text-red-600 border border-red-200' 
                                      : 'bg-muted text-muted-foreground border border-border'
                                  }`}>
                                    {ref.relevance}
                                  </span>
                                )}
                              </div>
                              {ref.description && (
                                <p className="text-xs text-muted-foreground leading-relaxed pl-1 border-l-2 border-border/50">
                                  {ref.description}
                                </p>
                              )}
                            </>
                        )}
                    </div>
                  </div>
                </motion.div>
              )) : (
                <div className="text-center py-10">
                    <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-muted mb-3">
                        <Scale className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium text-foreground">No legal references found</p>
                    <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
                        AI analysis did not identify specific legal citations in this document.
                    </p>
                </div>
              )}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalysisPanel;
