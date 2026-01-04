import { create } from 'zustand';
import api from '@/lib/api/api';

export const useAIStore = create((set) => ({
  chatHistory: [],
  isSending: false,
  error: null,

  // Analysis state
  analysisResult: null,
  isAnalyzing: false,

  sendMessage: async (caseId, message, history = []) => {
    set({ isSending: true, error: null });
    try {
      const { data: response } = await api.post('/ai/chat', {
        caseId,
        message,
        history,
      });
      // Return response so component can update its local history or store logic can be expanded
      set({ isSending: false });
      return response;
    } catch (error) {
      set({ error: error.message, isSending: false });
      throw error;
    }
  },

  analyzeDocument: async (documentId) => {
    set({ isAnalyzing: true, error: null });
    try {
       // Note: Spec says POST /ai/documents/analyze, assumed body needed or just ID?
       // Spec says "Response Data Requirements" but request body not fully detailed for that endpoint in summary.
       // Usually it might need doc ID.
       // Let's assume sending { documentId } or similar.
      const { data: response } = await api.post('/ai/documents/analyze', {
        documentId
      });
      set({ analysisResult: response, isAnalyzing: false });
      return response;
    } catch (error) {
      set({ error: error.message, isAnalyzing: false });
    }
  }
}));
