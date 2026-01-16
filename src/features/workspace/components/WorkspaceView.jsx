import React, { useState, useMemo } from 'react';
import {
    ChevronDown, Users, Folder, Settings, PanelLeft, PanelRight, Plus, ChevronRight, Search, FolderOpen, ArrowLeft,
    CheckSquare, Square
} from 'lucide-react';
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
        toggleSelectedForAI
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
        f.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            try {
                // Check if we already have a direct URL in the document object
                if (selectedDocument.cloudinaryUrl || selectedDocument.url || selectedDocument.secure_url) {
                    setPreviewUrl(selectedDocument.cloudinaryUrl || selectedDocument.url || selectedDocument.secure_url);
                } else {
                    const url = await fetchDocumentContent(docId);
                    if (active) {
                        setPreviewUrl(url);
                    }
                }
            } catch (err) {
                console.error("Failed to load preview url", err);
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
        <div className="flex flex-1 overflow-hidden relative z-20 animate-in fade-in slide-in-from-right-4 duration-500 h-full">

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

                        <TimerWidget />

                        <div className="flex items-center justify-between p-2 bg-secondary/30 rounded border border-border mt-3">
                            <div className="flex items-center gap-2"><Users size={12} className="text-primary" /><span className="text-xs text-muted-foreground">Client Access</span></div>
                            <div className="relative w-7 h-3.5 bg-muted rounded-full cursor-pointer border border-border"><div className="absolute right-0.5 top-0.5 w-2.5 h-2.5 bg-primary rounded-full shadow-sm"></div></div>
                        </div>

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
                                                            {file.name}
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

            {/* CENTER PANEL */}
            <main className="flex-1 flex flex-col min-w-0 bg-background relative transition-all duration-300">
                <div className="h-12 border-b border-accent/20 flex items-center justify-between px-4 bg-background/95 backdrop-blur-sm">
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

                <div className="flex-1 overflow-y-auto p-4">
                    <SmartFileUploader
                        caseId={activeCase.id}
                        folderName={currentFolder}
                        className="mb-4 border-2 border-dashed border-teal-accent/30 bg-transparent hover:border-accent/50 hover:bg-secondary/50 transition-all"
                        onUploadComplete={React.useCallback(() => {
                            // Re-fetch all documents to update folders and lists
                            fetchDocuments({ caseId: activeCase.id, force: true });
                        }, [activeCase.id, fetchDocuments])}
                    />

                    <div className="space-y-1">
                        {selectedDocument ? (
                            <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                                        <DocumentItem name={selectedDocument.name} type={selectedDocument.type} date={selectedDocument.date} status={selectedDocument.status} compact />
                                    </h3>
                                    <button onClick={() => setSelectedDocument(null)} className="text-xs text-teal-accent hover:text-foreground underline">Back to list</button>
                                </div>
                                <div className="bg-secondary/30 border border-accent/20 rounded-xl flex flex-col items-center justify-center min-h-[500px] text-muted-foreground overflow-hidden relative">
                                    {(previewUrl) ? (
                                        (() => {
                                            const isOffice = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(selectedDocument.type?.toLowerCase()) || 
                                                           /\.(doc|docx|ppt|pptx|xls|xlsx)$/i.test(selectedDocument.name);
                                            
                                            // Ensure we have a valid string URL
                                            if (!previewUrl || typeof previewUrl !== 'string') return null;

                                            const finalUrl = isOffice 
                                                ? `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(previewUrl)}`
                                                : previewUrl;

                                            return (
                                                <iframe 
                                                    src={finalUrl} 
                                                    className="w-full h-[500px] border-none"
                                                    title={selectedDocument.name}
                                                />
                                            );
                                        })()
                                    ) : (
                                        <div className="flex flex-col items-center justify-center p-6 text-center">
                                            {loadingPreview ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
                                                    <p className="text-muted-foreground">Loading preview...</p>
                                                </>
                                            ) : (
                                                <>
                                                    <p className="font-medium text-foreground">File Preview for <strong>{selectedDocument.name}</strong></p>
                                                    <p className="text-xs opacity-50 mt-2 mb-4">Preview not available.</p>
                                                    <p className="text-[10px] text-muted-foreground max-w-xs mx-auto">
                                                        Note: Unable to load document preview.
                                                    </p>
                                                    <div className="hidden">{JSON.stringify(selectedDocument)}</div>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <>
                                <h3 className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-1 flex items-center justify-between">
                                    <span>{currentFolder}</span>
                                    <span className="text-[9px] bg-secondary px-1.5 py-0.5 rounded-full text-foreground">{filteredFiles.length} items</span>
                                </h3>

                                {loading ? (
                                    <div className="text-center py-12 opacity-50">
                                        <p className="text-sm text-[#B0C4C3]">Loading...</p>
                                    </div>
                                ) : filteredFiles.length > 0 ? (
                                    filteredFiles.map((file, idx) => (
                                        <DocumentItem key={idx} {...file} onClick={() => setSelectedDocument(file)} />
                                    ))
                                ) : (
                                    <div className="text-center py-10 opacity-50">
                                        <FolderOpen size={40} className="mx-auto text-teal-accent mb-2" />
                                        <p className="text-sm text-muted-foreground">
                                            {searchTerm ? `No files match "${searchTerm}"` : "No files in this folder yet."}
                                        </p>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default WorkspaceView;
