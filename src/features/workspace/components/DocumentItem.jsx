import React, { useState } from 'react';
import { Folder, FileText, FileCheck, Trash2, X } from 'lucide-react';
import { cn } from "@/lib/utils";

const DocumentItem = ({ 
    id, 
    _id, 
    name, 
    fileName, 
    type, 
    date, 
    status, 
    indent = 0, 
    onClick, 
    onDelete,
    compact,
    isActive 
}) => {
    const displayName = fileName || name || 'Untitled';
    const [showConfirm, setShowConfirm] = useState(false);
    const docId = id || _id;
    
    const handleDeleteClick = (e) => {
        e.stopPropagation();
        setShowConfirm(true);
    };

    const handleConfirmDelete = (e) => {
        e.stopPropagation();
        if (onDelete && docId) {
            onDelete(docId);
        }
        setShowConfirm(false);
    };

    const handleCancelDelete = (e) => {
        e.stopPropagation();
        setShowConfirm(false);
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "group flex items-center justify-between py-1.5 px-2 rounded-md transition-colors animate-in fade-in slide-in-from-bottom-1 duration-300",
                compact ? "cursor-default" : "hover:bg-secondary cursor-pointer border-b border-accent/10 last:border-0",
                isActive && "bg-accent/50"
            )}
            style={{ paddingLeft: `${indent * 10 + 8}px` }}
        >
            <div className="flex items-center gap-2 flex-1 min-w-0">
                {type === 'folder' ? <Folder size={14} className="text-teal-accent flex-shrink-0" /> : <FileText size={14} className="text-muted-foreground flex-shrink-0" />}
                <div className="flex flex-col min-w-0">
                    <span className="text-sm text-foreground font-medium truncate">{displayName}</span>
                    <span className="text-[9px] text-muted-foreground">{date}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-2 flex-shrink-0">
                {/* Status badges */}
                {status === 'processing' && <span className="flex items-center gap-1 text-[9px] bg-accent/10 text-accent px-1.5 py-0.5 rounded-full border border-accent/30"><span className="w-1 h-1 bg-accent rounded-full animate-ping" />Processing</span>}
                {status === 'analyzed' && <span className="flex items-center gap-1 text-[9px] bg-teal-accent/10 text-teal-bright px-1.5 py-0.5 rounded-full border border-teal-accent/30"><FileCheck size={8} />AI Ready</span>}
                
                {/* Delete button with confirmation */}
                {!compact && onDelete && (
                    showConfirm ? (
                        <div className="flex items-center gap-1 animate-in zoom-in duration-200">
                            <button
                                onClick={handleConfirmDelete}
                                className="p-1 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded text-[9px] font-medium"
                                title="Confirm Delete"
                            >
                                Delete
                            </button>
                            <button
                                onClick={handleCancelDelete}
                                className="p-1 hover:bg-secondary rounded"
                                title="Cancel"
                            >
                                <X size={12} className="text-muted-foreground" />
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleDeleteClick}
                            className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-500 transition-all"
                            title="Delete Document"
                        >
                            <Trash2 size={12} className="text-muted-foreground hover:text-red-500" />
                        </button>
                    )
                )}
            </div>
        </div>
    );
};

export default DocumentItem;
