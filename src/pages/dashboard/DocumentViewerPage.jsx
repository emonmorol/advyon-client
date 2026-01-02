import React, { useState, useRef, useCallback } from 'react';
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

/**
 * DocumentViewerPage - Main document viewer page with AI analysis panel
 * Route: /dashboard/workspace/doc/:docId
 */
const DocumentViewerPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  
  // Viewer State
  const [zoom, setZoom] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(12); // Mock total pages
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

  // Mock document data
  const document = {
    id: docId,
    title: 'Contract Agreement - TechCorp Industries',
    type: 'PDF',
    size: '2.4 MB',
    pages: totalPages,
    uploadedAt: new Date().toLocaleDateString(),
    fileUrl: '/mock-document.pdf'
  };

  // Mock entities for highlighting
  const entities = [
    { id: '1', type: 'person', text: 'John Smith', position: { x: 15, y: 20, width: 12, height: 1.5 } },
    { id: '2', type: 'amount', text: '$2,500,000', position: { x: 45, y: 35, width: 15, height: 1.5 } },
    { id: '3', type: 'date', text: 'January 15, 2024', position: { x: 60, y: 42, width: 18, height: 1.5 } },
    { id: '4', type: 'organization', text: 'TechCorp Industries', position: { x: 20, y: 55, width: 20, height: 1.5 } },
  ];

  const [activeEntity, setActiveEntity] = useState(null);

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
              {document.title}
            </h1>
            <p className="text-xs text-muted-foreground">
              {document.type} • {document.size} • {document.pages} pages
            </p>
          </div>
        </div>

        {/* Right Section - Actions */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEntities(!showEntities)}
            className={`gap-2 ${showEntities ? 'text-accent' : 'text-muted-foreground'}`}
          >
            {showEntities ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
            <span className="hidden sm:inline">Entities</span>
          </Button>
          
          <div className="w-px h-6 bg-border mx-1" />
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleShare}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
          >
            <Share2 className="h-4 w-4" />
          </Button>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrint}
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
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
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
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
            className="h-9 w-9 text-muted-foreground hover:text-foreground"
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
                fileUrl={document.fileUrl}
                currentPage={currentPage}
                zoom={zoom}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
            
            {/* Entity Highlights Overlay */}
            {showEntities && (
              <EntityHighlight
                entities={entities}
                activeEntity={activeEntity}
                onEntityClick={handleEntityClick}
              />
            )}
          </div>
        </motion.div>

        {/* Resizable Divider */}
        {isPanelOpen && (
          <div
            className={`w-1 bg-border hover:bg-accent cursor-col-resize transition-colors ${isResizing ? 'bg-accent' : ''}`}
            onMouseDown={handleMouseDown}
          />
        )}

        {/* AI Analysis Panel */}
        {isPanelOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: panelWidth, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 overflow-hidden"
            style={{ width: panelWidth }}
          >
            <AIAnalysisPanel
              documentId={docId}
              analysis={{}}
            />
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
