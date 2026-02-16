import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Image as ImageIcon,
    FileCode,
    File,
    Download,
    ZoomIn,
    ZoomOut,
    AlertTriangle,
    Loader2,
} from 'lucide-react';
import PDFViewer from './PDFViewer';

/**
 * WBS-5.4 — Multi-type document adapter.
 * Selects the right viewer based on the file's MIME type.
 *
 * Supported types:
 *  - PDF            → PDFViewer (iframe)
 *  - Images         → zoomable <img>
 *  - Text/Markdown  → scrollable <pre>
 *  - DOCX           → Google Docs Viewer iframe
 *  - Unsupported    → download-only card
 */

// ─── MIME helpers ───────────────────────────────────────────────────
const isPDF = (t) => t === 'application/pdf';
const isImage = (t) => /^image\/(jpe?g|png|gif|webp|svg\+xml|bmp)$/i.test(t);
const isText = (t) =>
    /^text\/(plain|markdown|csv|html|css|javascript|xml)$/i.test(t) ||
    t === 'application/json' ||
    t === 'application/xml';
const isDOCX = (t) =>
    t === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    t === 'application/msword';

// ─── Image viewer ───────────────────────────────────────────────────
function ImageViewer({ fileUrl, fileName }) {
    const [imgZoom, setImgZoom] = useState(1);
    const [loaded, setLoaded] = useState(false);
    const [error, setError] = useState(false);

    const zoomIn = useCallback(() => setImgZoom((z) => Math.min(z + 0.25, 4)), []);
    const zoomOut = useCallback(() => setImgZoom((z) => Math.max(z - 0.25, 0.25)), []);

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <AlertTriangle className="h-10 w-10 text-amber-500" />
                <p className="text-sm">Failed to load image</p>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            {/* zoom controls */}
            <div className="flex items-center justify-center gap-2 py-2 bg-card border-b border-border">
                <button onClick={zoomOut} className="p-1.5 rounded hover:bg-accent/10 transition-colors" title="Zoom out">
                    <ZoomOut className="h-4 w-4" />
                </button>
                <span className="text-xs text-muted-foreground w-14 text-center">{Math.round(imgZoom * 100)}%</span>
                <button onClick={zoomIn} className="p-1.5 rounded hover:bg-accent/10 transition-colors" title="Zoom in">
                    <ZoomIn className="h-4 w-4" />
                </button>
            </div>
            {/* image canvas */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-gray-100/50 p-4">
                {!loaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                )}
                <motion.img
                    src={fileUrl}
                    alt={fileName}
                    onLoad={() => setLoaded(true)}
                    onError={() => setError(true)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: loaded ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="max-w-full max-h-full object-contain select-none"
                    style={{ transform: `scale(${imgZoom})`, transformOrigin: 'center' }}
                    draggable={false}
                />
            </div>
        </div>
    );
}

// ─── Text viewer ────────────────────────────────────────────────────
function TextViewer({ fileUrl, fileType }) {
    const [content, setContent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    React.useEffect(() => {
        let cancelled = false;
        setLoading(true);
        setError(null);

        fetch(fileUrl)
            .then((res) => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.text();
            })
            .then((text) => {
                if (!cancelled) setContent(text);
            })
            .catch((err) => {
                if (!cancelled) setError(err.message);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => { cancelled = true; };
    }, [fileUrl]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <AlertTriangle className="h-10 w-10 text-amber-500" />
                <p className="text-sm">Failed to load file: {error}</p>
            </div>
        );
    }

    const isJSON = fileType === 'application/json';

    return (
        <div className="h-full overflow-auto bg-[#1e1e2e] p-6">
            <pre className="text-sm font-mono text-[#cdd6f4] whitespace-pre-wrap break-words leading-relaxed">
                <code>{isJSON ? JSON.stringify(JSON.parse(content), null, 2) : content}</code>
            </pre>
        </div>
    );
}

// ─── DOCX viewer (Google Docs fallback) ─────────────────────────────
function DOCXViewer({ fileUrl, fileName }) {
    const [loading, setLoading] = useState(true);
    const encodedUrl = encodeURIComponent(fileUrl);
    const googleViewerUrl = `https://docs.google.com/gview?url=${encodedUrl}&embedded=true`;

    return (
        <div className="h-full flex flex-col">
            {loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/80">
                    <div className="flex flex-col items-center gap-3">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Loading document via Google Docs Viewer…</p>
                    </div>
                </div>
            )}
            <iframe
                src={googleViewerUrl}
                title={fileName}
                className="flex-1 w-full border-0"
                onLoad={() => setLoading(false)}
            />
        </div>
    );
}

// ─── Unsupported file card ──────────────────────────────────────────
function UnsupportedViewer({ fileName, fileType, fileSize, onDownload }) {
    return (
        <div className="h-full flex items-center justify-center bg-gray-50">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center gap-4 p-8 rounded-2xl bg-white shadow-lg border border-border max-w-sm text-center"
            >
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                    <File className="h-8 w-8 text-muted-foreground" />
                </div>
                <div>
                    <h3 className="font-semibold text-foreground text-lg mb-1">{fileName}</h3>
                    <p className="text-xs text-muted-foreground">{fileType || 'Unknown type'}</p>
                    {fileSize && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {(fileSize / 1024 / 1024).toFixed(2)} MB
                        </p>
                    )}
                </div>
                <p className="text-sm text-muted-foreground">
                    Preview is not available for this file type. You can download it instead.
                </p>
                {onDownload && (
                    <button
                        onClick={onDownload}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-white font-medium text-sm hover:bg-accent/90 transition-colors shadow-md"
                    >
                        <Download className="h-4 w-4" />
                        Download File
                    </button>
                )}
            </motion.div>
        </div>
    );
}

// ─── Type icon helper ───────────────────────────────────────────────
export function getFileTypeIcon(fileType) {
    if (isPDF(fileType)) return FileText;
    if (isImage(fileType)) return ImageIcon;
    if (isText(fileType)) return FileCode;
    return File;
}

// ─── Main adapter ───────────────────────────────────────────────────
export default function DocumentAdapter({
    fileUrl,
    fileType = '',
    fileName = 'document',
    fileSize,
    documentId,
    zoom = 1,
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    onDownload,
}) {
    const mime = (fileType || '').toLowerCase();

    if (isPDF(mime)) {
        return (
            <PDFViewer
                fileUrl={fileUrl}
                documentId={documentId}
                fileSize={fileSize}
                zoom={zoom}
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={onPageChange}
                onDownload={onDownload}
            />
        );
    }

    if (isImage(mime)) {
        return <ImageViewer fileUrl={fileUrl} fileName={fileName} />;
    }

    if (isText(mime)) {
        return <TextViewer fileUrl={fileUrl} fileType={mime} />;
    }

    if (isDOCX(mime)) {
        return <DOCXViewer fileUrl={fileUrl} fileName={fileName} />;
    }

    return (
        <UnsupportedViewer
            fileName={fileName}
            fileType={fileType}
            fileSize={fileSize}
            onDownload={onDownload}
        />
    );
}
