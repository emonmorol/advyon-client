import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
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
  MoreVertical,
  Maximize2,
  Minimize2,
  PanelRightClose,
  PanelRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { useDocumentsStore } from '@/store/documents';
import { useAIStore } from '@/store/useAIStore'; // Assuming this exists for document analysis

/**
 * DocumentViewerPage - Main document viewer page with AI analysis panel
 * Route: /dashboard/workspace/doc/:docId
 */
const DocumentViewerPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  
  // Store Hooks
  const { fetchDocumentContent } = useDocumentsStore();
  const { analyzeDocument, analysisResult, isAnalyzing } = useAIStore(); // Assuming similar actions

  // Local State for Doc Data
  const [docData, setDocData] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Viewer State
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(10); // Default, update if PDF metadata known
  const [rotation, setRotation] = useState(0);
  
  // Panel State
  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const [panelWidth, setPanelWidth] = useState(400);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showEntities, setShowEntities] = useState(true);
  
  // Resizer State
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const viewerContainerRef = useRef(null);

  const [activeEntity, setActiveEntity] = useState(null);

  // Fetch Data Effect
  useEffect(() => {
      const loadDoc = async () => {
          setIsLoading(true);
          try {
              // 1. Fetch Content URL
              const url = await fetchDocumentContent(docId);
              if (url) setFileUrl(url);

              // 2. Fetch AI Analysis (if not already cached/available)
              // This assumes AIStore can fetch analysis for a doc
              // Or we might need a separate call to get document metadata
              // For now, we simulate metadata or fetch it if possible.
              // Assuming analyzeDocument fetches existing analysis or triggers new
              // await analyzeDocument(docId);
              
              // Simulating metadata since we don't have a "getDocMeta" endpoint yet explicitly
              setDocData({
                  meta: {
                      title: `Document ${docId}`, // Placeholder
                      type: 'PDF',
                      size: 'Unknown',
                      pages: 10, // Placeholder
                      fileUrl: url
                  },
                  analysis: {
                      // Will be populated by AI store result preferably
                  },
                  entityHighlights: []
              });
          } catch (err) {
              console.error(err);
          } finally {
              setIsLoading(false);
          }
      };

      if (docId) loadDoc();
  }, [docId, fetchDocumentContent, analyzeDocument]);

  // Sync analysis result
  // useEffect(() => {
  //     if (analysisResult) {
  //         setDocData(prev => ({ ...prev, analysis: analysisResult }));
  //     }
  // }, [analysisResult]);

  // Handlers
  const handleBack = () => {
    navigate(-1);
  };

  const handleDownload = () => {
    console.log('Download document:', docId);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    console.log('Share document:', docId);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFitToWidth = () => {
    if (viewerContainerRef.current) {
      const { width } = viewerContainerRef.current.getBoundingClientRect();
      const pdfBaseWidth = 595; // Base width of the mock PDF
      const padding = 64; // p-8 = 2rem * 2 = 4rem ≈ 64px
      const availableWidth = width - padding;
      // Calculate zoom to fit, maxing out at 200% to avoid being too huge
      // Also ensure we don't zoom out too much (< 25%)
      const newZoom = Math.min(Math.max(availableWidth / pdfBaseWidth, 0.25), 2);
      setZoom(newZoom);
    }
  };

  const handleSearch = (query) => {
    console.log('Search for:', query);
  };

  const handleEntityClick = (entity) => {
    setActiveEntity(entity.id === activeEntity ? null : entity.id);
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

  // Resizer handlers
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isResizing) return;
    const containerRect = containerRef.current?.getBoundingClientRect();
    if (containerRect) {
      const newWidth = containerRect.right - e.clientX;
      setPanelWidth(Math.max(300, Math.min(600, newWidth)));
    }
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  if (isLoading || !docData) {
      return <div className="flex items-center justify-center h-screen">Loading Document...</div>;
  }

  return (
    <div 
      ref={containerRef}
      className="h-screen flex flex-col bg-background overflow-hidden"
    >
      {/* Viewer Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between px-4 py-3 bg-card border-b border-border"
      >
        {/* Left Section - Back & Title */}
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleBack}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="border-l border-border pl-4">
            <h1 className="font-semibold text-foreground truncate max-w-md">
              {docData.meta.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {docData.meta.type} • {docData.meta.size} • {docData.meta.pages} pages
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEntities(!showEntities)}
            className={`gap-2 ${showEntities ? 'text-accent' : 'text-muted-foreground'} hidden sm:flex`}
          >
            {showEntities ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="hidden md:inline">Entities</span>
          </Button>
          
          <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrint}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            <Printer className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleDownload}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Download className="h-4 w-4" />
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex"
          >
            {isFullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsPanelOpen(!isPanelOpen)}
            className={`h-9 w-9 hover:text-foreground ${isPanelOpen ? 'text-accent bg-accent/10' : 'text-muted-foreground'}`}
          >
            {isPanelOpen ? (
              <PanelRightClose className="h-4 w-4" />
            ) : (
              <PanelRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </motion.header>

      {/* Main Content - 2 Column Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Document Viewer Core */}
        <motion.div 
          className="flex-1 flex flex-col min-w-0"
          layout
        >
          {/* PDF Toolbar */}
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
          
          {/* PDF Viewer with Entity Overlay */}
          <div ref={viewerContainerRef} className="flex-1 relative overflow-hidden">
            <div 
              className="h-full"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              <PDFViewer
                fileUrl={fileUrl || docData.meta.fileUrl}
                currentPage={currentPage}
                zoom={zoom}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
            
            {/* Entity Highlights Overlay */}
            {showEntities && (
              <EntityHighlight
                entities={docData.entityHighlights}
                activeEntity={activeEntity}
                onEntityClick={handleEntityClick}
              />
            )}
          </div>
        </motion.div>

        {/* Resizable Divider - Desktop only */}
        {isPanelOpen && (
          <div
            className={`hidden md:block w-1 bg-border hover:bg-accent cursor-col-resize transition-colors ${isResizing ? 'bg-accent' : ''}`}
            onMouseDown={handleMouseDown}
          />
        )}

        {/* AI Analysis Panel */}
        {isPanelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0, x: 100 }}
            animate={{ 
              width: window.innerWidth < 768 ? '100%' : panelWidth, 
              opacity: 1, 
              x: 0 
            }}
            exit={{ width: 0, opacity: 0, x: 100 }}
            transition={{ duration: 0.2 }}
            className={`
              flex-shrink-0 overflow-hidden bg-background border-l border-border
              absolute inset-y-0 right-0 z-50 shadow-2xl md:relative md:shadow-none md:inset-auto md:border-none md:bg-transparent
            `}
            style={{ width: window.innerWidth < 768 ? '100%' : panelWidth }}
          >
            <div className="h-full flex flex-col md:block">
               {/* Mobile Header for Panel */}
               <div className="flex md:hidden items-center justify-between p-2 border-b border-border bg-card">
                 <span className="font-medium text-sm">AI Analysis</span>
                 <Button variant="ghost" size="sm" onClick={() => setIsPanelOpen(false)}>
                   <ArrowLeft className="h-4 w-4 mr-1" /> Back to Doc
                 </Button>
               </div>
               <AIAnalysisPanel
                 documentId={docId}
                 analysis={docData.analysis}
               />
            </div>
          </motion.aside>
        )}
      </div>

      {/* Viewer Footer - Page Indicator */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-center py-2 bg-card border-t border-border"
      >
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            Page <span className="font-medium text-foreground">{currentPage}</span> of{' '}
            <span className="font-medium text-foreground">{totalPages}</span>
          </span>
          <div className="w-px h-4 bg-border" />
          <span>Zoom: <span className="font-medium text-foreground">{Math.round(zoom * 100)}%</span></span>
        </div>
      </motion.footer>
    </div>
  );
};

export default DocumentViewerPage;
