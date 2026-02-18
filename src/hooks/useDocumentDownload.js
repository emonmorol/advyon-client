import { useState, useCallback, useRef } from 'react';
import { toast } from 'sonner';
import api from '@/lib/api/api';

/**
 * WBS-5.5 — Custom hook for downloading documents with progress tracking.
 *
 * Usage:
 *   const { downloadFile, downloadBatch, isDownloading, progress, error } = useDocumentDownload();
 *   await downloadFile(caseId, documentId);
 *   await downloadBatch(caseId, [id1, id2, id3]);
 */
export default function useDocumentDownload() {
    const [isDownloading, setIsDownloading] = useState(false);
    const [progress, setProgress] = useState(0); // 0-100
    const [error, setError] = useState(null);
    const [currentFile, setCurrentFile] = useState(null);
    const abortRef = useRef(null);

    /**
     * Download a single document.
     * 1. GET /documents/:caseId/:documentId/download → { downloadUrl, fileName }
     * 2. Fetch blob from Cloudinary URL
     * 3. Trigger browser <a> download
     */
    const downloadFile = useCallback(async (caseId, documentId) => {
        setIsDownloading(true);
        setProgress(0);
        setError(null);
        setCurrentFile(documentId);

        try {
            // Step 1: Get download URL from server
            setProgress(10);
            const { data } = await api.get(`/documents/${caseId}/${documentId}/download`);
            const { downloadUrl, fileName } = data?.data || {};

            if (!downloadUrl) {
                throw new Error('Download URL not available for this document');
            }

            // Step 2: Fetch blob with progress
            setProgress(30);
            const abortController = new AbortController();
            abortRef.current = abortController;

            const response = await fetch(downloadUrl, { signal: abortController.signal });

            if (!response.ok) {
                throw new Error(`Download failed: HTTP ${response.status}`);
            }

            // Read stream for progress
            const contentLength = response.headers.get('content-length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;

            if (total && response.body) {
                const reader = response.body.getReader();
                const chunks = [];
                let received = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    chunks.push(value);
                    received += value.length;
                    setProgress(30 + Math.round((received / total) * 60)); // 30-90%
                }

                const blob = new Blob(chunks);
                triggerBrowserDownload(blob, fileName || `document-${documentId}`);
            } else {
                // Fallback: no content-length → no progress
                setProgress(60);
                const blob = await response.blob();
                triggerBrowserDownload(blob, fileName || `document-${documentId}`);
            }

            setProgress(100);
            toast.success('Download complete', { description: fileName });
        } catch (err) {
            if (err.name === 'AbortError') {
                toast.info('Download cancelled');
            } else {
                const msg = err?.response?.data?.message || err.message || 'Download failed';
                setError(msg);
                toast.error('Download failed', { description: msg });
            }
        } finally {
            setIsDownloading(false);
            setCurrentFile(null);
            abortRef.current = null;
        }
    }, []);

    /**
     * Download multiple documents sequentially.
     */
    const downloadBatch = useCallback(async (caseId, documentIds = []) => {
        if (!documentIds.length) return;

        setIsDownloading(true);
        setError(null);

        const total = documentIds.length;
        let completed = 0;
        const errors = [];

        for (const docId of documentIds) {
            setCurrentFile(docId);
            setProgress(Math.round((completed / total) * 100));

            try {
                await downloadFile(caseId, docId);
                completed++;
            } catch (err) {
                errors.push({ docId, error: err.message });
                completed++;
            }
        }

        setProgress(100);
        setIsDownloading(false);
        setCurrentFile(null);

        if (errors.length) {
            toast.warning(`Downloaded ${total - errors.length}/${total} files`, {
                description: `${errors.length} file(s) failed`,
            });
        } else {
            toast.success(`All ${total} files downloaded`);
        }
    }, [downloadFile]);

    /**
     * Cancel the current download.
     */
    const cancelDownload = useCallback(() => {
        abortRef.current?.abort();
    }, []);

    return {
        downloadFile,
        downloadBatch,
        cancelDownload,
        isDownloading,
        progress,
        error,
        currentFile,
    };
}

// ─── Helper ─────────────────────────────────────────────────────────
function triggerBrowserDownload(blob, fileName) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();

    // Cleanup
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}
