import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api/api';

/**
 * Custom hook for smart document upload with AI analysis polling
 * 
 * @param {string} caseId - The case ID to upload the document to
 * @returns {object} SmartUploadState - Structured upload states and actions
 */
export const useSmartUpload = (caseId) => {
  const queryClient = useQueryClient();
  
  // Local state for tracking upload progress and document ID
  const [uploadProgress, setUploadProgress] = useState(0);
  const [documentId, setDocumentId] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [error, setError] = useState(null);
  const [status, setStatus] = useState('idle'); // 'idle' | 'uploading' | 'analyzing' | 'completed' | 'failed'

  // Upload mutation
  // Endpoint: POST /api/v1/cases/:caseId/documents
  const uploadMutation = useMutation({
    mutationFn: async ({ file, folderName }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (folderName) {
        formData.append('folder', folderName);
      }

      const response = await api.post(
        `/cases/${caseId}/documents`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const progress = progressEvent.total
              ? Math.round((progressEvent.loaded * 100) / progressEvent.total)
              : 0;
            setUploadProgress(progress);
          },
        }
      );

      return response.data;
    },
    onMutate: () => {
      setStatus('uploading');
      setUploadProgress(0);
      setError(null);
      setAnalysisResult(null);
      setDocumentId(null);
    },
    onSuccess: (data) => {
      // Check for id directly or nested in document object (handle both response formats)
      const docId = data.data?.id || data.data?.document?.id;
      
      if (data.success && docId) {
        setDocumentId(docId);
        setStatus('analyzing');
      } else {
        setError(new Error('Upload failed: Invalid response'));
        setStatus('failed');
      }
    },
    onError: (err) => {
      setError(err);
      setStatus('failed');
    },
  });

  // Status polling query - only enabled when analyzing
  // Endpoint: GET /api/v1/cases/:caseId/documents/:documentId/status
  const statusQuery = useQuery({
    queryKey: ['documentStatus', caseId, documentId],
    queryFn: async () => {
      const response = await api.get(
        `/cases/${caseId}/documents/${documentId}/status`
      );
      return response.data;
    },
    enabled: status === 'analyzing' && !!documentId && !!caseId,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Stop polling when completed or failed
      if (data?.data?.processingStatus === 'completed' || 
          data?.data?.processingStatus === 'failed') {
        return false;
      }
      // Continue polling every 1 second while processing
      return 1000;
    },
    refetchIntervalInBackground: false,
  });

  // Handle status changes from polling
  if (statusQuery.data?.data) {
    const { processingStatus, aiAnalysis, error: statusError } = statusQuery.data.data;
    
    if (processingStatus === 'completed' && aiAnalysis && status === 'analyzing') {
      setAnalysisResult(aiAnalysis);
      setStatus('completed');
      // Invalidate related queries to refresh document lists
      queryClient.invalidateQueries({ queryKey: ['documents', caseId] });
    } else if (processingStatus === 'failed' && status === 'analyzing') {
      setError(new Error(statusError || 'Document processing failed'));
      setStatus('failed');
    }
  }

  // Handle polling errors
  if (statusQuery.error && status === 'analyzing') {
    setError(statusQuery.error);
    setStatus('failed');
  }

  // Upload handler
  const upload = useCallback(({ file, folderName }) => {
    if (!caseId) {
      setError(new Error('Case ID is required'));
      setStatus('failed');
      return;
    }
    // Mutate expects a single argument, passing object to be handled in mutationFn
    uploadMutation.mutate({ file, folderName });
  }, [caseId, uploadMutation]);

  // Reset handler
  const reset = useCallback(() => {
    setUploadProgress(0);
    setDocumentId(null);
    setAnalysisResult(null);
    setError(null);
    setStatus('idle');
    uploadMutation.reset();
  }, [uploadMutation]);

  return {
    isUploading: status === 'uploading',
    uploadProgress,
    isAnalyzing: status === 'analyzing',
    analysisResult,
    error,
    status,
    upload,
    reset,
    documentId,
  };
};

export default useSmartUpload;
