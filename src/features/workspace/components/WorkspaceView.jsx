import React, { useState, useMemo } from 'react';
import {
    ChevronDown, Users, Folder, Settings, PanelLeft, PanelRight, Plus, ChevronRight, Search, FolderOpen, ArrowLeft,
    CheckSquare, Square, PanelRightClose, Maximize2
} from 'lucide-react';
import { Group as PanelGroup, Panel, Separator as PanelResizeHandle } from 'react-resizable-panels';
import { cn } from "@/lib/utils";
import DocumentItem from './DocumentItem';
import TimerWidget from './TimerWidget';
import { useDocumentsStore } from '@/store/documents';
import { useCasesStore } from '@/store/cases';
import { SmartFileUploader } from '@/components/SmartFileUploader';
import { useNavigate } from 'react-router-dom';

const WorkspaceView = ({ activeCase, onSwitchCase, searchTerm, onBack }) => {
    const navigate = useNavigate();
    const [showLeftSidebar, setShowLeftSidebar] = useState(true);
    const [isCaseSwitcherOpen, setIsCaseSwitcherOpen] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState([activeCase.title]);
    const [expandedFolders, setExpandedFolders] = useState([]);

    // Store Integration
    const { 
        fetchDocuments, 
        getDocuments, 
        isLoading, 
        selectedDocument, 
        setSelectedDocument,
        selectedForAI,
        toggleSelectedForAI,
        deleteDocument
    } = useDocumentsStore();

    // Fetch ALL documents for the case on mount or case change
    React.useEffect(() => {
        if (activeCase?.id) {
            // Fetching with no folder param gets all documents for the case
            fetchDocuments({ caseId: activeCase.id, force: true });
        }
        return () => setSelectedDocument(null);
    }, [activeCase?.id, fetchDocuments, setSelectedDocument]);

    // Get all documents for the current case
    const allCaseDocs = getDocuments(activeCase.id) || [];

    // Derive dynamic folders from documents
    const folderStats = useMemo(() => {
        const stats = {};
        allCaseDocs.forEach(doc => {
            // Ensure folderName is a string and fallback to 'General' if missing
            const folder = doc.folderName || 'General';
            if (!stats[folder]) {
                stats[folder] = [];
            }
            stats[folder].push(doc);
        });
        return stats;
    }, [allCaseDocs]);

    const dynamicFolders = useMemo(() => Object.keys(folderStats).sort(), [folderStats]);

    // Determine current folder:
    // If we have clicked a folder, it's in the breadcrumbs.
    // If not, default to the first available folder or 'General' if distinct folders exist.
    const derivedCurrentFolder = useMemo(() => {
        const lastCrumb = breadcrumbs[breadcrumbs.length - 1];
        // If the last breadcrumb is the case title, it means no folder is selected yet.
        if (lastCrumb === activeCase.title) {
            return dynamicFolders.length > 0 ? dynamicFolders[0] : 'General';
        }
        // Otherwise, the last breadcrumb IS the folder name.
        return lastCrumb;
    }, [breadcrumbs, activeCase.title, dynamicFolders]);
    
    // Ensure the current folder actually exists in our derived list, otherwise fallback safely
    const currentFolder = dynamicFolders.includes(derivedCurrentFolder) ? derivedCurrentFolder : (dynamicFolders[0] || 'General');

    // Filter files for the main view
    const currentFiles = folderStats[currentFolder] || [];
    
    // Check loading state for the root fetch
    const loading = isLoading(activeCase.id); 

    // Filter files based on search term
    const filteredFiles = currentFiles.filter(f =>
        (f.fileName || f.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Fetch Content for selected document
    const { fetchDocumentContent } = useDocumentsStore();
    const [previewUrl, setPreviewUrl] = useState(null);
    const [loadingPreview, setLoadingPreview] = useState(false);

    React.useEffect(() => {
        let active = true;
        const loadPreview = async () => {
             const docId = selectedDocument?.id || selectedDocument?._id;
            if (!docId || !activeCase?.id) {
                setPreviewUrl(null);
                return;
            }
            
            setLoadingPreview(true);
            console.log('[Preview] Loading for doc:', docId, 'cloudinaryUrl:', selectedDocument.cloudinaryUrl);
            
            try {
                // Check if we already have a direct URL in the document object
                const directUrl = selectedDocument.cloudinaryUrl || selectedDocument.url || selectedDocument.secure_url;
                if (directUrl) {
                    console.log('[Preview] Using direct cloudinary URL:', directUrl);
                    setPreviewUrl(directUrl);
                } else {
                    console.log('[Preview] Fetching content URL from API...');
                    const url = await fetchDocumentContent(docId);
                    console.log('[Preview] Fetched URL:', url);
                    if (active) {
                        setPreviewUrl(url);
                    }
                }
            } catch (err) {
                console.error("[Preview] Failed to load preview url", err);
                setPreviewUrl(null);
            } finally {
                if (active) setLoadingPreview(false);
            }
        };

        if (selectedDocument) {
            loadPreview();
        } else {
             setPreviewUrl(null);
        }
        
        return () => { active = false; };
    }, [selectedDocument, activeCase, fetchDocumentContent]);


    const handleFolderClick = (folder) => {
        setBreadcrumbs([activeCase.title, folder]);
        setSelectedDocument(null);
        setExpandedFolders(prev =>
            prev.includes(folder)
                ? prev.filter(f => f !== folder)
                : [...prev, folder]
        );
    };

    const handleFileClick = (folder, file) => {
        setBreadcrumbs([activeCase.title, folder]);
        if (!expandedFolders.includes(folder)) {
            setExpandedFolders(prev => [...prev, folder]);
        }
        navigate(`/dashboard/workspace/doc/${file.id || file._id}`);
        setSelectedDocument(file);
    };

    return (
        <div className="flex flex-1 overflow-hidden relative z-20 animate-in fade-in slide-in-from-right-4 duration-500 h-full p-0">

            {/* LEFT SIDEBAR */}
            <aside className={cn("bg-card border-r border-border flex flex-col transition-all duration-300 ease-in-out", showLeftSidebar ? "w-64 translate-x-0 opacity-100" : "w-0 -translate-x-full opacity-0 overflow-hidden border-none")}>
                <div className="w-64 flex flex-col h-full overflow-hidden">
                    <div className="p-3 overflow-y-auto custom-scrollbar flex-1">

                        {/* Quick Case Switcher */}
                        <div className="mb-4 relative">
                            <button
                                onClick={() => setIsCaseSwitcherOpen(!isCaseSwitcherOpen)}
                                className="w-full text-left flex items-start justify-between group"
                            >
                                <div>
                                    <h2 className="text-lg font-bold text-foreground leading-tight mb-0.5 group-hover:text-primary transition-colors flex items-center gap-2">
                                        {activeCase.title} <ChevronDown size={14} className={`transition-transform duration-200 ${isCaseSwitcherOpen ? 'rotate-180' : ''}`} />
                                    </h2>
                                    <p className="text-xs text-muted-foreground">Case #{activeCase.ref}</p>
                                </div>
                            </button>

                            {/* Dropdown Menu */}
                            {isCaseSwitcherOpen && (
                                <div className="absolute top-full left-0 w-full mt-2 bg-card border border-border rounded-lg shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200 overflow-hidden">
                                    <div className="p-2 bg-secondary/50 border-b border-border">
                                        <p className="text-[10px] text-muted-foreground font-bold uppercase">Switch Case</p>
                                    </div>
                                    <div className="max-h-48 overflow-y-auto custom-scrollbar">
                                        {useCasesStore.getState().cases.filter(c => c.id !== activeCase.id).map(c => (
                                            <button
                                                key={c.id}
                                                onClick={() => { onSwitchCase(c); setIsCaseSwitcherOpen(false); }}
                                                className="w-full text-left px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors border-b border-border last:border-0"
                                            >
                                                <div className="font-medium">{c.title}</div>
                                                <div className="text-[10px] text-muted-foreground">{c.ref} • {c.urgency} priority</div>
                                            </button>
                                        ))}
                                        <button className="w-full text-left px-3 py-2 text-xs text-primary hover:underline border-t border-border bg-card">
                                            View All Cases in Dashboard
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-3">
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-[10px] rounded border border-primary/20">{activeCase.type}</span>
                            <span className="px-2 py-0.5 bg-accent/10 text-accent text-[10px] rounded border border-accent/30">{activeCase.status}</span>
                        </div>

                        {/* <TimerWidget />

                        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded border border-border mt-3">
                            <div className="flex items-center gap-2"><Users size={12} className="text-primary" /><span className="text-xs text-muted-foreground">Client Access</span></div>
                            <div className="relative w-7 h-3.5 bg-muted rounded-full cursor-pointer border border-border"><div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></div></div>
                        </div> */}

                        {/* Folder Navigation Tree */}
                        <div className="mt-4 space-y-0.5">
                            <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1">Folders</div>
                            {dynamicFolders.length === 0 && !loading && (
                                <div className="text-xs text-muted-foreground px-2 italic">No folders yet</div>
                            )}
                            
                            {dynamicFolders.map((folder) => {
                                const isExpanded = expandedFolders.includes(folder);
                                const isCurrent = currentFolder === folder;
                                const files = folderStats[folder] || [];

                                return (
                                    <div key={folder} className="mb-0.5">
                                        <button
                                            onClick={() => handleFolderClick(folder)}
                                            className={cn(
                                                "w-full flex items-center justify-between px-2 py-1 text-sm rounded-md transition-all group hover:bg-secondary",
                                                isCurrent ? "bg-accent text-primary font-medium" : "text-muted-foreground"
                                            )}
                                        >
                                            <div className="flex items-center gap-2">
                                                <ChevronRight size={12} className={cn("transition-transform duration-200", isExpanded && "rotate-90")} />
                                                <Folder size={14} className={isCurrent ? "text-primary" : "text-muted-foreground group-hover:text-primary"} />
                                                <span className="truncate text-xs">{folder}</span>
                                            </div>
                                            <span className="text-[9px] bg-accent/80 px-1 rounded text-muted-foreground border border-border/50">{files.length}</span>
                                        </button>

                                        {/* Nested Files */}
                                        {isExpanded && (
                                            <div className="ml-5 mt-0.5 space-y-0.5 border-l border-border pl-2">
                                                {files.map((file, idx) => (
                                                    <div key={idx} className="flex items-center gap-0.5 group/item w-full">
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); toggleSelectedForAI(file.id || file._id); }}
                                                            className={cn(
                                                                "p-0.5 shrink-0 rounded hover:bg-muted transition-colors",
                                                                selectedForAI.includes(file.id || file._id) ? "text-primary opacity-100" : "text-muted-foreground opacity-0 group-hover/item:opacity-100"
                                                            )}
                                                            title="Select for AI Context"
                                                        >
                                                            {selectedForAI.includes(file.id || file._id) ? 
                                                                <CheckSquare size={11} fill="currentColor" className="text-primary-foreground" /> : 
                                                                <Square size={11} />
                                                            }
                                                        </button>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleFileClick(folder, file); }}
                                                            className={cn(
                                                                "flex-1 text-left px-2 py-0.5 text-[11px] rounded-md transition-colors truncate flex items-center gap-2",
                                                                selectedDocument?.id === file.id
                                                                    ? "bg-accent text-primary font-medium"
                                                                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                                                            )}
                                                        >
                                                            <span className={cn("w-1 h-1 rounded-full flex-shrink-0", selectedDocument?.id === file.id ? "bg-primary" : "bg-muted-foreground")}></span>
                                                            {file.fileName || file.name}
                                                        </button>
                                                    </div>
                                                ))}
                                                {files.length === 0 && (
                                                    <div className="px-2 py-0.5 text-[9px] text-muted-foreground/50 italic">No files</div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div className="mt-auto p-3 border-t border-border bg-card">
                        <button className="w-full flex items-center justify-center gap-2 py-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"><Settings size={12} /> Workspace Settings</button>
                    </div>
                </div>
            </aside>

            {/* CENTER & RIGHT PANELS */}
            <main className="flex-1 flex flex-col min-w-0 bg-background relative transition-all duration-300 overflow-hidden">
                <div className="h-12 border-b border-accent/20 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm shrink-0">
                    <div className="flex items-center text-sm text-muted-foreground gap-2 overflow-x-auto no-scrollbar">
                        <button onClick={onBack} className="p-1 rounded-md hover:bg-primary/10 text-teal-accent hover:text-foreground transition-colors mr-1 flex-shrink-0" title="Back to Dashboard">
                            <ArrowLeft size={16} />
                        </button>
                        <button onClick={() => setShowLeftSidebar(!showLeftSidebar)} className={cn("p-1 rounded-md hover:bg-primary/10 text-teal-accent transition-colors mr-1 flex-shrink-0", !showLeftSidebar && "bg-primary/10")}>
                            <PanelLeft size={16} />
                        </button>
                        {breadcrumbs.map((item, index) => (
                            <React.Fragment key={index}>
                                <span className={cn("cursor-pointer hover:text-foreground transition-colors whitespace-nowrap text-xs", index === breadcrumbs.length - 1 ? "text-foreground font-medium" : "text-muted-foreground")}>{item}</span>
                                {index < breadcrumbs.length - 1 && <ChevronRight size={12} className="text-teal-accent flex-shrink-0" />}
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 ml-3 flex-shrink-0">
                        <button className="flex items-center gap-1.5 bg-accent hover:bg-accent/90 text-accent-foreground px-3 py-1 rounded-md text-xs font-semibold transition-all shadow-sm"><Plus size={14} /><span className="hidden sm:inline">Upload File</span></button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                     <PanelGroup direction="horizontal">
                        {/* Doc List Panel */}
                        <Panel 
                            defaultSize={40} 
                            minSize={30}
                            maxSize={70}
                        >
                            <div className="h-full overflow-y-auto custom-scrollbar">
                                <SmartFileUploader
                                    caseId={activeCase.id}
                                    folderName={currentFolder}
                                    className="mb-4 border-2 border-dashed border-teal-accent/30 bg-transparent hover:border-accent/50 hover:bg-secondary/50 transition-all"
                                    onUploadComplete={React.useCallback(() => {
                                        console.log('[WorkspaceView] Upload complete, refreshing documents...');
                                        fetchDocuments({ caseId: activeCase.id, force: true });
                                    }, [activeCase.id, fetchDocuments])}
                                />

                                {/* Header with folder info and total count */}
                                <div className="flex items-center justify-between mb-3 px-2">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                                            {currentFolder}
                                        </h3>
                                        <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                                            {filteredFiles.length} files
                                        </span>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground">
                                        Total: {allCaseDocs.length} docs in {dynamicFolders.length} folders
                                    </span>
                                </div>

                                <div className="space-y-1 px-2">
                                    {loading ? (
                                        <div className="text-center py-12 opacity-50">
                                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto mb-2"></div>
                                            <p className="text-sm text-muted-foreground">Loading documents...</p>
                                        </div>
                                    ) : filteredFiles.length > 0 ? (
                                        filteredFiles.map((file, idx) => (
                                            <DocumentItem 
                                                key={file.id || file._id || idx} 
                                                {...file}
                                                status={file.analysisStatus || file.processingStatus}
                                                date={file.uploadedAt ? new Date(file.uploadedAt).toLocaleDateString() : ''}
                                                onClick={() => setSelectedDocument(selectedDocument?.id === file.id ? null : file)} 
                                                isActive={selectedDocument?.id === file.id}
                                                onDelete={async (docId) => {
                                                    try {
                                                        await deleteDocument({ caseId: activeCase.id, documentId: docId, folder: currentFolder });
                                                        if (selectedDocument?.id === docId || selectedDocument?._id === docId) {
                                                            setSelectedDocument(null);
                                                        }
                                                        fetchDocuments({ caseId: activeCase.id, force: true });
                                                    } catch (err) {
                                                        console.error('Delete failed:', err);
                                                    }
                                                }}
                                            />
                                        ))
                                    ) : (
                                        <div className="text-center py-10 opacity-50">
                                            <FolderOpen size={40} className="mx-auto text-teal-accent mb-2" />
                                            <p className="text-sm text-muted-foreground">
                                                {searchTerm ? `No files match "${searchTerm}"` : "No files in this folder yet."}
                                            </p>
                                            <p className="text-xs text-muted-foreground/70 mt-1">
                                                Upload a document above or select a different folder
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Panel>

                        {/* Resize Handle - ALWAYS RENDERED */}
                        <PanelResizeHandle className="w-1 bg-border hover:bg-accent ring-1 ring-border/50 transition-colors cursor-col-resize flex items-center justify-center">
                            <div className="w-0.5 h-8 bg-muted-foreground/30 rounded-full" />
                        </PanelResizeHandle>

                        {/* Preview Panel - ALWAYS RENDERED with collapsible */}
                        <Panel 
                            defaultSize={60} 
                            minSize={30} 
                            maxSize={70}
                            collapsible={true}
                            collapsedSize={0}
                            defaultCollapsed={!selectedDocument}
                        >
                            {selectedDocument ? (
                                <div className="h-full border-l border-border bg-background flex flex-col overflow-hidden">
                                     <div className="flex items-center justify-between p-3 border-b border-border bg-card/50">
                                        <div className="flex items-center gap-2 truncate">
                                            <DocumentItem name={selectedDocument.name} type={selectedDocument.type} date={selectedDocument.date} status={selectedDocument.status} compact />
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => navigate(`/dashboard/workspace/doc/${selectedDocument.id || selectedDocument._id}`)} className="text-xs flex items-center gap-1 hover:text-primary transition-colors"><Maximize2 size={12}/> Expand</button>
                                            <button onClick={() => setSelectedDocument(null)} className="text-muted-foreground hover:text-foreground"><PanelRightClose size={14} /></button>
                                        </div>
                                    </div>
                                    
                                    <div className="flex-1 overflow-y-auto p-4 bg-secondary/10">
                                        <div className="bg-background border border-border rounded-xl shadow-sm overflow-hidden h-full flex flex-col">
                                            {(previewUrl) ? (
                                                <div className="flex-1 bg-white relative">
                                                    {(() => {
                                                        const fileExt = (selectedDocument.fileName || selectedDocument.name || '').split('.').pop()?.toLowerCase();
                                                        const isOffice = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(fileExt);
                                                        const isPdf = fileExt === 'pdf' || selectedDocument.fileType?.includes('pdf');
                                                        
                                                        if (!previewUrl || typeof previewUrl !== 'string') return null;

                                                        // Use Google Docs Viewer for PDFs and Office files (handles CORS)
                                                        const finalUrl = (isPdf || isOffice)
                                                            ? `https://docs.google.com/gview?url=${encodeURIComponent(previewUrl)}&embedded=true`
                                                            : previewUrl;

                                                        return (
                                                            <iframe 
                                                                src={finalUrl} 
                                                                className="w-full h-full border-none"
                                                                title={selectedDocument.fileName || selectedDocument.name}
                                                                loading="lazy"
                                                            />
                                                        );
                                                    })()}
                                                </div>
                                            ) : (
                                                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                                                    {loadingPreview ? (
                                                        <>
                                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                                                            <p className="text-muted-foreground">Loading preview...</p>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <p className="font-medium text-foreground">File Preview</p>
                                                            <p className="text-xs opacity-50 mt-2">Preview not available.</p>
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Auto-filing Badge or Info */}
                                        {selectedDocument.autoFiling && (
                                            <div className="mt-4 p-3 bg-blue-50/10 border border-blue-500/20 rounded-lg">
                                                <h4 className="text-xs font-semibold text-blue-400 mb-1">Auto-Filing Status</h4>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className={cn("px-1.5 py-0.5 rounded capitalize", 
                                                        selectedDocument.autoFiling.status === 'moved' ? "bg-green-500/10 text-green-400" : "bg-yellow-500/10 text-yellow-400"
                                                    )}>
                                                        {selectedDocument.autoFiling.status}
                                                    </span>
                                                    <span className="text-muted-foreground">Confidence: {Math.round(selectedDocument.autoFiling.confidenceScore * 100)}%</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-muted-foreground bg-background/50 border-l border-border">
                                    <p className="text-sm">Select a document to preview</p>
                                </div>
                            )}
                        </Panel>
                     </PanelGroup>
                </div>
            </main>
        </div>
    );
};

export default WorkspaceView;
