import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels';
import { 
  PDFViewer, 
  PDFToolbar, 
  AIAnalysisPanel, 
  EntityHighlight 
} from '@/features/documents';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2, 
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDocumentsStore } from '@/store/documents';
import { useAIStore } from '@/store/useAIStore';

/**
 * DocumentViewerPage - Main document viewer page with AI analysis panel
 * Route: /dashboard/workspace/doc/:docId
 * Uses react-resizable-panels for split-pane layout
 */
const DocumentViewerPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  
  // Store Hooks
  const { fetchDocumentById, setSelectedDocument } = useDocumentsStore();
  const { analyzeDocument, isAnalyzing } = useAIStore(); 

  // Local State for Doc Data
  const [docData, setDocData] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Viewer State
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10);
  const [rotation, setRotation] = useState(0);
  
  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEntities, setShowEntities] = useState(true);
  
  const containerRef = useRef(null);
  const viewerContainerRef = useRef(null); // Used for fit-to-width calculation

  const [activeEntity, setActiveEntity] = useState(null);

  // Fetch Data Effect
  useEffect(() => {
      const loadDoc = async () => {
          setIsLoading(true);
          try {
              const doc = await fetchDocumentById(docId);
              if (doc) {
                  setDocData({
                      meta: {
                          title: doc.fileName || `Document ${docId}`,
                          type: doc.fileType || 'PDF',
                          size: doc.fileSize ? `${(doc.fileSize / 1024 / 1024).toFixed(2)} MB` : 'Unknown',
                          pages: 0,
                          fileUrl: doc.cloudinaryUrl
                      },
                      analysis: {
                          refinedSummary: doc.aiAnalysis?.summary || '',
                          rawSummary: doc.aiAnalysis?.rawSummary || doc.aiAnalysis?.summary || '',
                          keyPoints: (doc.aiAnalysis?.keyPoints || []).map(kp => ({
                              text: kp,
                              importance: 'medium',
                              category: 'General'
                          })),
                          entities: doc.aiAnalysis?.extractedEntities?.map(e => ({
                              name: e.name || e,
                              type: e.type || 'other',
                              count: e.count || 1
                          })) || [],
                          legalRefs: doc.aiAnalysis?.legalRefs || []
                      } || {}, 
                      entityHighlights: doc.aiAnalysis?.extractedEntities?.map(e => ({
                          id: e.name || e,
                          text: e.name || e,
                          type: e.type || 'other',
                          count: e.count || 1
                      })) || []
                  });
                  setFileUrl(doc.cloudinaryUrl);
                  setSelectedDocument(doc);
              }
          } catch (err) {
              console.error("Failed to load document:", err);
          } finally {
              setIsLoading(false);
          }
      };

      if (docId) loadDoc();
      return () => setSelectedDocument(null);
  }, [docId, fetchDocumentById, setSelectedDocument]);

  // Handlers
  const handleBack = () => navigate(-1);
  const handleDownload = () => console.log('Download', docId);
  const handlePrint = () => window.print();
  const handleShare = () => console.log('Share', docId);
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360);
  const handleSearch = (q) => console.log('Search', q);
  const handleEntityClick = (e) => setActiveEntity(e.id === activeEntity ? null : e.id);

  const handleFitToWidth = () => {
    if (viewerContainerRef.current) {
      const { width } = viewerContainerRef.current.getBoundingClientRect();
      const pdfBaseWidth = 595; 
      const newZoom = Math.min(Math.max(width / pdfBaseWidth, 0.25), 2);
      setZoom(newZoom);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  if (isLoading || !docData) {
      return <div className="flex items-center justify-center h-screen"><Loader2 className="animate-spin mr-2" /> Loading Document...</div>;
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen flex flex-col bg-background overflow-hidden"
    >
      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 bg-card border-b border-border z-10"
      >
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="h-9 w-9">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="border-l border-border pl-4">
            <h1 className="font-semibold text-foreground truncate max-w-md">{docData.meta.title}</h1>
            <p className="text-xs text-muted-foreground">{docData.meta.type} • {docData.meta.size}</p>
          </div>
        </div>

        <div className="flex items-center gap-1 sm:gap-2">
          <Button variant="ghost" size="sm" onClick={() => setShowEntities(!showEntities)} className={showEntities ? 'text-accent' : ''}>
            {showEntities ? <Eye className="h-4 w-4 mr-2" /> : <EyeOff className="h-4 w-4 mr-2" />}
            <span className="hidden md:inline">Entities</span>
          </Button>
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          <Button variant="ghost" size="icon" onClick={handleShare}><Share2 className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={handlePrint}><Printer className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={handleDownload}><Download className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={toggleFullscreen}>
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon" onClick={() => setIsPanelOpen(!isPanelOpen)} className={isPanelOpen ? 'text-accent bg-accent/10' : ''}>
            {isPanelOpen ? <PanelRightClose className="h-4 w-4" /> : <PanelRight className="h-4 w-4" />}
          </Button>
        </div>
      </motion.header>

      {/* Main Content with Split Pane */}
      <div className="flex-1 overflow-hidden">
        <PanelGroup direction="horizontal">
          {/* Document Viewer Panel */}
          <Panel defaultSize={65} minSize={30} className="flex flex-col min-w-0">
             <div className="flex-1 flex flex-col h-full">
              <PDFToolbar
                zoom={zoom}
                page={currentPage}
                totalPages={totalPages}
                onZoom={setZoom}
                onPageChange={setCurrentPage}
                onSearch={handleSearch}
                onRotate={handleRotate}
                onFitToWidth={handleFitToWidth}
              />
              
              <div ref={viewerContainerRef} className="flex-1 relative overflow-hidden bg-gray-100/50">
                <div className="h-full" style={{ transform: `rotate(${rotation}deg)` }}>
                  <PDFViewer
                    fileUrl={fileUrl || docData.meta.fileUrl}
                    currentPage={currentPage}
                    zoom={zoom}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
                {showEntities && (
                  <EntityHighlight
                    entities={docData.entityHighlights}
                    activeEntity={activeEntity}
                    onEntityClick={handleEntityClick}
                  />
                )}
              </div>
            </div>
          </Panel>

          {/* Resize Handle */}
          {isPanelOpen && (
            <PanelResizeHandle className="w-1 bg-border hover:bg-accent ring-1 ring-border/50 transition-colors cursor-col-resize flex items-center justify-center">
               <div className="w-0.5 h-8 bg-muted-foreground/30 rounded-full" />
            </PanelResizeHandle>
          )}

          {/* AI Analysis Panel */}
          {isPanelOpen && (
            <Panel defaultSize={35} minSize={20} maxSize={50} collapsible={true} onCollapse={() => setIsPanelOpen(false)}>
              <div className="h-full overflow-y-auto bg-background border-l border-border">
                <AIAnalysisPanel
                   documentId={docId}
                   analysis={docData.analysis}
                 />
              </div>
            </Panel>
          )}
        </PanelGroup>
      </div>

      <motion.footer className="flex items-center justify-center py-2 bg-card border-t border-border mt-auto">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>Page <span className="font-medium text-foreground">{currentPage}</span> of {totalPages}</span>
          <div className="w-px h-4 bg-border" />
          <span>Zoom: <span className="font-medium text-foreground">{Math.round(zoom * 100)}%</span></span>
        </div>
      </motion.footer>
    </div>
  );
};
export default DocumentViewerPage;
