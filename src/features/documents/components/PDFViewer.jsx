import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { FileText, Loader2, AlertTriangle, RefreshCw, Download } from 'lucide-react';
import api from '@/lib/api/api';

/**
 * WBS-5.3 — Production-ready PDF viewer with:
 *  - Animated skeleton loading state
 *  - Large-file warning gate (> 25 MB)
 *  - Error boundary-safe rendering
 *  - iframe-based display with zoom
 */

const LARGE_FILE_THRESHOLD = 25 * 1024 * 1024; // 25 MB

// ─── Loading skeleton ───────────────────────────────────────────────
const PDFSkeleton = () => (
  <div className="flex items-center justify-center min-h-full p-8">
    <div
      className="bg-white shadow-2xl rounded-sm animate-pulse"
      style={{ width: 595, minHeight: 842 }}
    >
      <div className="p-8 space-y-4">
        {/* Header skeleton */}
        <div className="border-b-2 border-primary/20 pb-4 mb-6">
          <div className="h-8 bg-primary/10 rounded w-3/4 mb-2" />
          <div className="h-4 bg-muted rounded w-1/2" />
        </div>
        {/* Paragraph skeletons */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-2">
            <div className="h-3 bg-muted/60 rounded w-full" />
            <div className="h-3 bg-muted/60 rounded w-11/12" />
            <div className="h-3 bg-muted/60 rounded w-10/12" />
            <div className="h-6" />
          </div>
        ))}
      </div>
    </div>
  </div>
);

const PDFViewer = ({
  fileUrl,
  documentId,
  fileSize,
  fileName,
  fileType,
  onPageChange,
  currentPage = 1,
  zoom = 1,
  totalPages = 1,
  onDownload,
}) => {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolvedUrl, setResolvedUrl] = useState(null);
  const [largeFileAccepted, setLargeFileAccepted] = useState(false);

  // Large file gate
  const isLargeFile = fileSize && fileSize > LARGE_FILE_THRESHOLD;

  const loadContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    const upgradeToHttps = (url) => {
        if (typeof url === 'string') {
            return url.replace(/^http:\/\//i, 'https://');
        }
        return url;
    };

    try {
      if (fileUrl) {
        setResolvedUrl(upgradeToHttps(fileUrl));
        setIsLoading(false);
        return;
      }

      // Fetch content URL from API if documentId provided
      if (documentId) {
        const response = await api.get(`/documents/${documentId}/content`);
        const url = response.data?.data?.url || response.data?.url;
        if (url) {
          setResolvedUrl(upgradeToHttps(url));
        } else {
          throw new Error('No content URL returned');
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load document');
    } finally {
      setIsLoading(false);
    }
  }, [fileUrl, documentId]);

  useEffect(() => {
    loadContent();
  }, [loadContent]);

  // ─── Large file warning gate ────────────────────────────────────
  if (isLargeFile && !largeFileAccepted) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg border border-border p-6 gap-4 text-center">
        <AlertTriangle className="h-12 w-12 text-amber-500" />
        <div>
          <p className="font-medium text-foreground mb-1">Large Document</p>
          <p className="text-sm text-muted-foreground">
            This file is {(fileSize / (1024 * 1024)).toFixed(1)} MB. Loading it may be slow.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLargeFileAccepted(true)}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm"
          >
            Load Anyway
          </button>
          {onDownload && (
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition text-sm flex items-center gap-2"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          )}
        </div>
      </div>
    );
  }

  // ─── Error state ────────────────────────────────────────────────
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full bg-background rounded-lg border border-border gap-4 p-6 text-center">
        <FileText className="h-16 w-16 text-muted-foreground" />
        <p className="text-destructive font-medium">Failed to load document</p>
        <p className="text-muted-foreground text-sm">{error}</p>
        <button
          onClick={loadContent}
          className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" /> Retry
        </button>
      </div>
    );
  }

  // ─── Loading skeleton ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="h-full w-full bg-background rounded-lg border border-border overflow-hidden">
        <PDFSkeleton />
      </div>
    );
  }

  // Determine file type from various sources
  const getFileExtension = () => {
    if (fileName) {
      return fileName.split('.').pop()?.toLowerCase();
    }
    if (fileType) {
      // Handle mime types like "application/pdf"
      return fileType.split('/').pop()?.toLowerCase();
    }
    return null;
  };

  const fileExt = getFileExtension();
  const isPdf = fileExt === 'pdf' || (fileType && fileType.includes('pdf'));
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp'].includes(fileExt) || 
                  (fileType && fileType.startsWith('image/'));
  const isOffice = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(fileExt);

  // ─── Document render ─────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-auto bg-muted/30 rounded-lg custom-scrollbar"
    >
      {resolvedUrl ? (
        <div className="w-full h-full">
          {/* PDF Documents */}
          {isPdf && (
            <iframe
              src={`${resolvedUrl}#page=${currentPage}&toolbar=1&navpanes=1`}
              className="w-full h-full border-0"
              title={fileName || "PDF Document"}
              style={{
                transform: `scale(${zoom})`,
                transformOrigin: 'top left',
                width: zoom !== 1 ? `${100 / zoom}%` : '100%',
                height: zoom !== 1 ? `${100 / zoom}%` : '100%',
              }}
              onLoad={() => setIsLoading(false)}
            />
          )}

          {/* Image Files */}
          {isImage && (
            <div className="flex items-center justify-center min-h-full p-4">
              <img
                src={resolvedUrl}
                alt={fileName || "Document"}
                className="max-w-full max-h-full object-contain shadow-lg rounded-lg"
                style={{ transform: `scale(${zoom})` }}
                onLoad={() => setIsLoading(false)}
                onError={() => setError('Failed to load image')}
              />
            </div>
          )}

          {/* Office Documents - Use Google Docs Viewer */}
          {isOffice && (
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(resolvedUrl)}&embedded=true`}
              className="w-full h-full border-0"
              title={fileName || "Office Document"}
              onLoad={() => setIsLoading(false)}
            />
          )}

          {/* Other file types - Show download option */}
          {!isPdf && !isImage && !isOffice && (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
              <FileText className="h-16 w-16 text-muted-foreground" />
              <p className="font-medium text-foreground">{fileName || "Document"}</p>
              <p className="text-sm text-muted-foreground">
                This file type cannot be previewed directly
              </p>
              {onDownload && (
                <button
                  onClick={onDownload}
                  className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download to View
                </button>
              )}
            </div>
          )}
        </div>
      ) : (
        /* Fallback placeholder when no URL */
        <motion.div
          className="flex items-center justify-center min-h-full p-8"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div
            className="bg-white shadow-2xl rounded-sm transition-transform duration-200"
            style={{
              width: `${595 * zoom}px`,
              minHeight: `${842 * zoom}px`,
            }}
          >
            <div className="p-8 space-y-4">
              <div className="border-b-2 border-primary pb-4 mb-6">
                <div className="h-8 bg-primary/10 rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
              {[...Array(8)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 bg-muted/60 rounded w-full" />
                  <div className="h-3 bg-muted/60 rounded w-11/12" />
                  <div className="h-3 bg-muted/60 rounded w-10/12" />
                  <div className="h-3 bg-muted/60 rounded w-9/12" />
                  <div className="h-6" />
                </div>
              ))}
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
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default PDFViewer;

