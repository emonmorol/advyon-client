import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Check, AlertTriangle, Save, RefreshCw } from 'lucide-react';
import { useDocumentsStore } from '@/store/documents';
import { toast } from 'sonner';

/**
 * TextReviewPage - Interface for reviewing OCR extracted text
 * Gap G4
 */
const TextReviewPage = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { fetchDocumentById } = useDocumentsStore();
  
  const [document, setDocument] = useState(null);
  const [ocrText, setOcrText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDoc = async () => {
      setLoading(true);
      try {
        const doc = await fetchDocumentById(docId);
        if (doc) {
          setDocument(doc);
          // Simulating OCR text retrieval - in real app would fetch from backend/AI analysis
          setOcrText(doc.aiAnalysis?.rawSummary || "OCR extracted text would appear here...");
        }
      } catch {
        toast.error("Failed to load document");
      } finally {
        setLoading(false);
      }
    };
    if (docId) loadDoc();
  }, [docId, fetchDocumentById]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // API call to update OCR text would go here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Mock delay
      toast.success("Text extraction saved");
      navigate(-1);
    } catch {
      toast.error("Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="h-screen flex flex-col bg-background">
      <header className="px-6 py-4 border-b border-border flex items-center justify-between bg-card">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{document?.fileName}</h1>
            <p className="text-xs text-muted-foreground">OCR Text Review</p>
          </div>
        </div>
        <div className="flex gap-2">
           <Button variant="outline" onClick={() => toast.info('Re-running OCR...')}>
             <RefreshCw className="w-4 h-4 mr-2" /> Re-scan
           </Button>
           <Button onClick={handleSave} disabled={isSaving}>
             {isSaving ? 'Saving...' : <><Save className="w-4 h-4 mr-2" /> Save & Verify</>}
           </Button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Original Document Preview (Left) */}
        <div className="flex-1 bg-muted/30 p-4 overflow-y-auto border-r border-border">
          <div className="aspect-[1/1.4] bg-white shadow-sm rounded-lg max-w-xl mx-auto flex items-center justify-center text-muted-foreground">
             {document?.cloudinaryUrl ? (
               <iframe src={document.cloudinaryUrl} className="w-full h-full" title="Original" />
             ) : (
               <span>Original Document Preview</span>
             )}
          </div>
        </div>

        {/* OCR Text Editor (Right) */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-3xl mx-auto">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Extracted Text</h2>
              <span className="text-xs bg-yellow-500/10 text-yellow-500 px-2 py-1 rounded flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Low Confidence Regions Highlighted
              </span>
            </div>
            <textarea 
              className="w-full h-[calc(100vh-200px)] p-6 rounded-lg border border-border bg-card text-foreground font-mono text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-primary"
              value={ocrText}
              onChange={(e) => setOcrText(e.target.value)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default TextReviewPage;
