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
  // Mock data for demonstration
  const mockAnalysis = {
    summary: analysis.summary || `This legal document pertains to the contractual agreement between the parties regarding the acquisition of intellectual property rights. The agreement outlines the terms of transfer, including compensation structure, warranties, and dispute resolution mechanisms.

Key provisions include a 30-day notice period for termination, binding arbitration clause, and confidentiality obligations extending 5 years beyond contract termination.`,
    keyPoints: analysis.keyPoints || [
      { text: 'Contract value estimated at $2.5M with structured payment over 24 months', importance: 'high', category: 'Financial' },
      { text: 'Intellectual property transfers upon final payment completion', importance: 'high', category: 'IP Rights' },
      { text: '30-day notice period required for contract termination', importance: 'medium', category: 'Terms' },
      { text: 'Binding arbitration in New York for dispute resolution', importance: 'medium', category: 'Legal' },
      { text: 'Confidentiality obligations extend 5 years post-termination', importance: 'low', category: 'Compliance' },
    ],
    entities: analysis.entities || [
      { type: 'person', name: 'John Smith', count: 12 },
      { type: 'person', name: 'Sarah Johnson', count: 8 },
      { type: 'organization', name: 'TechCorp Industries', count: 15 },
      { type: 'organization', name: 'Legal Partners LLP', count: 6 },
      { type: 'date', name: 'January 15, 2024', count: 3 },
      { type: 'date', name: 'December 31, 2025', count: 2 },
      { type: 'amount', name: '$2,500,000', count: 4 },
      { type: 'amount', name: '$125,000', count: 2 },
      { type: 'location', name: 'New York, NY', count: 5 },
    ],
    legalRefs: analysis.legalRefs || [
      { citation: 'UCC § 2-201', description: 'Statute of Frauds requirement for contracts over $500', relevance: 'high' },
      { citation: 'Smith v. Jones, 2019', description: 'Precedent for IP transfer validity', relevance: 'high' },
      { citation: 'N.Y. Gen. Bus. Law § 349', description: 'Consumer protection provisions', relevance: 'medium' },
      { citation: '17 U.S.C. § 204', description: 'Copyright transfer requirements', relevance: 'medium' },
    ]
  };

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
              rawSummary={analysis.rawSummary}
              refinedSummary={analysis.refinedSummary || mockAnalysis.summary}
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
                {mockAnalysis.keyPoints.length} Key Points Identified
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6" title="Download key points">
                <Download className="h-3.5 w-3.5" />
              </Button>
            </div>
            <KeyPointsList points={mockAnalysis.keyPoints} />
          </motion.div>
        </TabsContent>

        {/* Entities Tab */}
        <TabsContent value="entities" className="flex-1 overflow-auto custom-scrollbar m-0 p-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                {mockAnalysis.entities.length} Entities Found
              </span>
            </div>
            
            <EntityLegend />
            
            <div className="space-y-2">
              {mockAnalysis.entities.map((entity, index) => {
                const IconComponent = getEntityIcon(entity.type);
                const colorClass = getEntityColor(entity.type);
                
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.03 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded ${colorClass}`}>
                        <IconComponent className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-sm text-foreground">{entity.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded-full">
                      {entity.count}x
                    </span>
                  </motion.div>
                );
              })}
            </div>
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
              {mockAnalysis.legalRefs.map((ref, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg border border-border bg-background hover:border-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <BookOpen className="h-4 w-4 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-sm text-foreground">{ref.citation}</span>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full uppercase font-medium ${
                          ref.relevance === 'high' 
                            ? 'bg-destructive/10 text-destructive' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {ref.relevance}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{ref.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AIAnalysisPanel;
