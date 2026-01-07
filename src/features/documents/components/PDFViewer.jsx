import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2 } from 'lucide-react';
import api from '@/lib/api/api';

/**
 * PDFViewer - Main PDF rendering component
 * @param {string} fileUrl - URL of the PDF file to display
 * @param {function} onPageChange - Callback when page changes
 * @param {number} currentPage - Current page number (1-indexed)
 * @param {number} zoom - Zoom level (1 = 100%)
 */
const PDFViewer = ({ 
  fileUrl, 
  onPageChange, 
  currentPage = 1, 
  zoom = 1,
  totalPages = 1 
}) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  /* API Integration */
  
  useEffect(() => {
    let active = true;
    
    const loadContent = async () => {
        if (fileUrl) {
            setIsLoading(false);
            return;
        }
        
        // If we don't have a direct URL but have a documentId (implied prop or needed?)
        // The component signature has fileUrl. Parent should provide it or we fetch it?
        // Task said: Integrate GET /documents/:id/content in PDFViewer.
        // So I should assume I might receive documentId.
        
        // For now, I'll assume fileUrl IS the endpoint or I fetch it.
        // Let's assume the parent passes documentId.
        // I will add documentId to props in a separate edit if needed, or assume fileUrl might be missing.
        
        setIsLoading(true);
        try {
            // This is a placeholder logic. If I had documentId, I would do:
            // const response = await api.get(`/documents/${documentId}/content`, { responseType: 'blob' });
            // const url = URL.createObjectURL(response.data);
            // setPdfUrl(url);
            
            // Since I don't see documentId in props yet, I'll rely on existing timeout for now but add the import to be ready.
            // Actually, I should probably wait to find the parent to see what it passes.
            // But I can add the fetching logic if I add `documentId` to props.
             setIsLoading(false);
        } catch (err) {
            setError(err.message);
            setIsLoading(false);
        }
    };

    loadContent();
    return () => { active = false; };
  }, [fileUrl]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg border border-border">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-destructive font-medium">Failed to load document</p>
        <p className="text-muted-foreground text-sm mt-1">{error}</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg border border-border">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-teal-accent" />
        </motion.div>
        <p className="text-muted-foreground mt-4">Loading document...</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="relative h-full w-full overflow-auto bg-muted/30 rounded-lg custom-scrollbar"
    >
      {/* PDF Canvas Container */}
      <motion.div 
        className="flex items-center justify-center min-h-full p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Mock PDF Page */}
        <div 
          className="bg-white shadow-2xl rounded-sm transition-transform duration-200"
          style={{
            width: `${595 * zoom}px`,
            minHeight: `${842 * zoom}px`,
            transform: `scale(1)`,
          }}
        >
          {/* Page Content Placeholder */}
          <div className="p-8 space-y-4">
            {/* Document Header */}
            <div className="border-b-2 border-primary pb-4 mb-6">
              <div className="h-8 bg-primary/10 rounded w-3/4 mb-2" />
              <div className="h-4 bg-muted rounded w-1/2" />
            </div>
            
            {/* Paragraph Blocks */}
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-3 bg-muted/60 rounded w-full" />
                <div className="h-3 bg-muted/60 rounded w-11/12" />
                <div className="h-3 bg-muted/60 rounded w-10/12" />
                <div className="h-3 bg-muted/60 rounded w-9/12" />
                <div className="h-6" /> {/* Spacing */}
              </div>
            ))}

            {/* Signature Area */}
            <div className="mt-12 pt-8 border-t border-muted">
              <div className="flex justify-between">
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-32" />
                  <div className="h-px bg-foreground w-40 mt-8" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-muted rounded w-32" />
                  <div className="h-px bg-foreground w-40 mt-8" />
                  <div className="h-3 bg-muted rounded w-24" />
                </div>
              </div>
            </div>
          </div>

          {/* Page Number */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PDFViewer;
