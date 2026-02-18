import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  Sparkles, 
  Edit3, 
  Eye, 
  Copy, 
  Check,
  Save,
  RotateCcw,
  RefreshCw,
  Clock,
  Database
} from 'lucide-react';

const FALLBACK_RAW_SUMMARY = 'No raw summary available yet.';
const FALLBACK_REFINED_SUMMARY = 'No refined summary available yet.';

/**
 * SummaryContent - Markdown editor with Raw and Refined subviews
 * Features:
 * - Persistent editing with localStorage and/or API save
 * - Timestamps showing when content was last edited
 * - Regenerate AI summary from edited raw text
 * 
 * @param {string} documentId - ID of the document (for storage key)
 * @param {string} rawSummary - Exact extracted text from document
 * @param {string} refinedSummary - AI cleaned-up summary
 * @param {function} onRawChange - Callback when raw summary is saved (for API)
 * @param {function} onRefinedChange - Callback when refined summary is saved (for API)
 * @param {function} onRegenerateFromRaw - Callback to regenerate AI summary from raw text
 */
const SummaryContent = ({ 
  documentId = 'default',
  rawSummary = '',
  refinedSummary = '',
  onRawChange,
  onRefinedChange,
  onRegenerateFromRaw
}) => {
  const [activeView, setActiveView] = useState('refined');
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'saved', 'error'

  // Storage keys based on document ID
  const STORAGE_KEYS = useMemo(() => ({
    raw: `advyon_doc_${documentId}_raw`,
    rawMeta: `advyon_doc_${documentId}_raw_meta`,
    refined: `advyon_doc_${documentId}_refined`,
    refinedMeta: `advyon_doc_${documentId}_refined_meta`,
  }), [documentId]);

  // State for saved content
  const [savedRawContent, setSavedRawContent] = useState('');
  const [savedRefinedContent, setSavedRefinedContent] = useState('');
  const [rawLastEdited, setRawLastEdited] = useState(null);
  const [refinedLastEdited, setRefinedLastEdited] = useState(null);

  // Load saved content from props first, then localStorage, no demo fallback
  useEffect(() => {
    const loadSavedContent = () => {
      try {
        // PRIORITY ORDER: Props data > localStorage > empty
        
        // Raw content: prefer prop, then localStorage
        if (rawSummary && rawSummary.trim()) {
          setSavedRawContent(rawSummary);
        } else {
          const savedRaw = localStorage.getItem(STORAGE_KEYS.raw);
          const savedRawMeta = localStorage.getItem(STORAGE_KEYS.rawMeta);
          if (savedRaw) {
            setSavedRawContent(savedRaw);
            if (savedRawMeta) {
              const meta = JSON.parse(savedRawMeta);
              setRawLastEdited(new Date(meta.lastEdited));
            }
          } else {
            setSavedRawContent('');
          }
        }

        // Refined content: prefer prop, then localStorage
        if (refinedSummary && refinedSummary.trim()) {
          setSavedRefinedContent(refinedSummary);
        } else {
          const savedRefined = localStorage.getItem(STORAGE_KEYS.refined);
          const savedRefinedMeta = localStorage.getItem(STORAGE_KEYS.refinedMeta);
          if (savedRefined) {
            setSavedRefinedContent(savedRefined);
            if (savedRefinedMeta) {
              const meta = JSON.parse(savedRefinedMeta);
              setRefinedLastEdited(new Date(meta.lastEdited));
            }
          } else {
            setSavedRefinedContent('');
          }
        }
      } catch (error) {
        console.error('Error loading saved content:', error);
        // Use props as final fallback
        setSavedRawContent(rawSummary || '');
        setSavedRefinedContent(refinedSummary || '');
      }
    };

    loadSavedContent();
  }, [documentId, rawSummary, refinedSummary]);

  const currentContent = activeView === 'raw' ? savedRawContent : savedRefinedContent;
  const currentLastEdited = activeView === 'raw' ? rawLastEdited : refinedLastEdited;

  const handleEdit = () => {
    setEditContent(currentContent);
    setIsEditing(true);
  };

  // Save to localStorage and optionally to API
  const handleSave = useCallback(async () => {
    const now = new Date();
    setSaveStatus('saving');

    try {
      if (activeView === 'raw') {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.raw, editContent);
        localStorage.setItem(STORAGE_KEYS.rawMeta, JSON.stringify({
          lastEdited: now.toISOString(),
          documentId
        }));
        
        setSavedRawContent(editContent);
        setRawLastEdited(now);
        
        // Call API callback if provided
        if (onRawChange) {
          await onRawChange(editContent, now);
        }
      } else {
        // Save to localStorage
        localStorage.setItem(STORAGE_KEYS.refined, editContent);
        localStorage.setItem(STORAGE_KEYS.refinedMeta, JSON.stringify({
          lastEdited: now.toISOString(),
          documentId
        }));
        
        setSavedRefinedContent(editContent);
        setRefinedLastEdited(now);
        
        // Call API callback if provided
        if (onRefinedChange) {
          await onRefinedChange(editContent, now);
        }
      }

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving content:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    }
  }, [activeView, editContent, documentId, onRawChange, onRefinedChange, STORAGE_KEYS]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleRegenerateFromRaw = async () => {
    setIsRegenerating(true);
    
    try {
      if (onRegenerateFromRaw) {
        const newRefinedContent = await onRegenerateFromRaw(savedRawContent);
        if (newRefinedContent) {
          const now = new Date();
          localStorage.setItem(STORAGE_KEYS.refined, newRefinedContent);
          localStorage.setItem(STORAGE_KEYS.refinedMeta, JSON.stringify({
            lastEdited: now.toISOString(),
            documentId,
            regeneratedFromRaw: true
          }));
          setSavedRefinedContent(newRefinedContent);
          setRefinedLastEdited(now);
        }
      } else {
        // Mock regeneration
        await new Promise(resolve => setTimeout(resolve, 2000));
        const regeneratedContent = `${savedRefinedContent}\n\n---\n*Regenerated from updated source at ${new Date().toLocaleString()}*`;
        const now = new Date();
        localStorage.setItem(STORAGE_KEYS.refined, regeneratedContent);
        localStorage.setItem(STORAGE_KEYS.refinedMeta, JSON.stringify({
          lastEdited: now.toISOString(),
          documentId,
          regeneratedFromRaw: true
        }));
        setSavedRefinedContent(regeneratedContent);
        setRefinedLastEdited(now);
      }
    } catch (error) {
      console.error('Error regenerating:', error);
    }
    
    setIsRegenerating(false);
  };

  // Clear saved content (for testing/reset)
  const handleClearSaved = () => {
    Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
    setSavedRawContent(rawSummary || FALLBACK_RAW_SUMMARY);
    setSavedRefinedContent(refinedSummary || FALLBACK_REFINED_SUMMARY);
    setRawLastEdited(null);
    setRefinedLastEdited(null);
  };

  // Format timestamp for display
  const formatTimestamp = (date) => {
    if (!date) return null;
    const now = new Date();
    const diff = now - date;
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Simple Markdown renderer
  const renderMarkdown = (text) => {
    return text
      .split('\n')
      .map((line, i) => {
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-base font-semibold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-sm font-semibold text-foreground mt-3 mb-1">{line.slice(4)}</h3>;
        }
        if (line.includes('**')) {
          const parts = line.split(/\*\*(.*?)\*\*/g);
          return (
            <p key={i} className="text-sm text-foreground leading-relaxed">
              {parts.map((part, j) => 
                j % 2 === 1 ? <strong key={j} className="font-semibold text-accent">{part}</strong> : part
              )}
            </p>
          );
        }
        if (line.startsWith('- ')) {
          return <li key={i} className="text-sm text-foreground ml-4 list-disc">{line.slice(2)}</li>;
        }
        if (/^\d+\.\s/.test(line)) {
          return <li key={i} className="text-sm text-foreground ml-4 list-decimal">{line.replace(/^\d+\.\s/, '')}</li>;
        }
        if (line.startsWith('*') && line.endsWith('*') && !line.startsWith('**')) {
          return <p key={i} className="text-xs text-muted-foreground italic mt-2">{line.slice(1, -1)}</p>;
        }
        if (line.trim() === '---') {
          return <hr key={i} className="my-3 border-border" />;
        }
        if (line.trim() === '') {
          return <div key={i} className="h-2" />;
        }
        return <p key={i} className="text-sm text-foreground leading-relaxed">{line}</p>;
      });
  };

  return (
    <div className="space-y-4">
      {/* Subview Toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
          <button
            onClick={() => { setActiveView('raw'); setIsEditing(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'raw' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            Raw
            {rawLastEdited && (
              <span className="ml-1 px-1.5 py-0.5 bg-accent/20 text-accent text-[10px] rounded flex items-center gap-0.5">
                <Database className="h-2.5 w-2.5" />
                Saved
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveView('refined'); setIsEditing(false); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
              activeView === 'refined' 
                ? 'bg-background text-foreground shadow-sm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            Refined
            {refinedLastEdited && (
              <span className="ml-1 px-1.5 py-0.5 bg-accent/20 text-accent text-[10px] rounded flex items-center gap-0.5">
                <Database className="h-2.5 w-2.5" />
                Saved
              </span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Save Status Indicator */}
          {saveStatus && (
            <span className={`text-xs px-2 py-1 rounded ${
              saveStatus === 'saving' ? 'bg-muted text-muted-foreground' :
              saveStatus === 'saved' ? 'bg-teal-accent/20 text-teal-bright' :
              'bg-destructive/20 text-destructive'
            }`}>
              {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved!' : 'Error'}
            </span>
          )}
          
          {isEditing ? (
            null
          ) : (
            /* View Mode - Icon buttons */
            <>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleCopy}
                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                title="Copy"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-teal-bright" /> : <Copy className="h-3.5 w-3.5" />}
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleEdit}
                className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <Edit3 className="h-3.5 w-3.5 mr-1" />
                Edit
              </Button>
              {activeView === 'raw' && rawLastEdited && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleRegenerateFromRaw}
                  disabled={isRegenerating}
                  className="h-7 w-7 text-accent hover:text-accent"
                  title="Regenerate AI summary from updated raw text"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Label with Timestamp */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {activeView === 'raw' ? (
            <>
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                Extracted Text (Markdown)
              </span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs text-muted-foreground uppercase tracking-wide">
                AI Refined Summary
              </span>
            </>
          )}
        </div>
        
        {currentLastEdited && (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Saved {formatTimestamp(currentLastEdited)}</span>
          </div>
        )}
      </div>

      {/* Regenerate Banner */}
      {activeView === 'refined' && rawLastEdited && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between p-3 bg-accent/10 border border-accent/30 rounded-lg"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-xs text-foreground">
              Raw text was updated. Regenerate to apply changes to AI summary.
            </span>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRegenerateFromRaw}
            disabled={isRegenerating}
            className="h-7 text-xs text-accent hover:text-accent hover:bg-accent/20"
          >
            {isRegenerating ? (
              <>
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-1" />
                Regenerate
              </>
            )}
          </Button>
        </motion.div>
      )}

      {/* Content Area */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${activeView}-${isEditing}`}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15 }}
          className={`rounded-lg border ${
            activeView === 'raw' 
              ? 'border-border bg-muted/30' 
              : 'border-accent/20 bg-accent/5'
          }`}
        >
          {isEditing ? (
            <div className="p-3">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full h-64 p-3 text-sm font-mono bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent custom-scrollbar"
                placeholder="Enter markdown content..."
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Editing in Markdown • {editContent.length} chars</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={handleCancel}
                    className="h-7 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    Cancel
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleSave}
                    className="h-7 px-3 text-xs bg-accent text-accent-foreground hover:bg-accent/90 shadow-sm"
                  >
                    <Save className="h-3.5 w-3.5 mr-1.5" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          ) : currentContent && currentContent.trim() ? (
            <div className="p-4 space-y-1 max-h-96 overflow-y-auto custom-scrollbar">
              {renderMarkdown(currentContent)}
            </div>
          ) : (
            <div className="p-6 flex flex-col items-center justify-center text-center">
              <Sparkles className="h-10 w-10 text-muted-foreground/30 mb-3" />
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {activeView === 'raw' ? 'No Raw Summary Available' : 'No AI Summary Available'}
              </p>
              <p className="text-xs text-muted-foreground/70 max-w-[200px]">
                {activeView === 'raw' 
                  ? 'The raw extracted text from this document is not yet available.'
                  : 'AI analysis has not been completed for this document yet.'}
              </p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Footer */}
      <div className="pt-3 border-t border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Database className="h-3.5 w-3.5 text-teal-accent" />
            <span>
              {currentLastEdited 
                ? `Saved locally • Doc: ${documentId}`
                : 'Not yet saved'
              }
            </span>
          </div>
          {currentLastEdited && (
            <span className="text-xs text-accent font-medium">
              ✓ Persisted
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default SummaryContent;
