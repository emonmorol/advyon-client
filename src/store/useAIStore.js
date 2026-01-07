import { create } from 'zustand';
import api from '@/lib/api/api';

export const useAIStore = create((set) => ({
  histories: {
    global: [],
  }, // { global: [], [contextKey]: [] }
  activeContext: 'global',
  
  isSending: false,
  error: null,

  // Analysis state
  analysisResult: null,
  isAnalyzing: false,

  setContext: (contextKey) => set({ activeContext: contextKey }),

  getHistory: () => {
      const state = useAIStore.getState();
      return state.histories[state.activeContext] || [];
  },

  addMessage: (message, type = 'user') => set((state) => {
      const currentHistory = state.histories[state.activeContext] || [];
      return {
          histories: {
              ...state.histories,
              [state.activeContext]: [
                  ...currentHistory,
                  { ...message, timestamp: new Date(), type }
              ]
          }
      };
  }),

  sendMessage: async (caseId, message, context = {}) => {
    set({ isSending: true, error: null });
    const state = useAIStore.getState();
    const currentHistory = state.histories[state.activeContext] || [];

    // Add user message to history immediately (optimistic update handled by component usually, but good to ensure sync)
    // Actually component does optimistic update. We should rely on component calling addMessage or handle it here.
    // Let's standardise: Component calls sendMessage, we update history here.

    try {
        // Construct history for API (last 10) - Backend also slices, but good to be safe
       const apiHistory = currentHistory.map(h => ({ role: h.type, content: h.text }));
    
      const payload = {
        caseId: caseId !== 'general' ? caseId : undefined,
        message,
        history: apiHistory,
      };
      
      // If we have document context, attach it
      if (context.documentId) {
        payload.documentId = context.documentId;
      }
      
      const { data: response } = await api.post('/ai/chat', payload);
      
      const botResponseText = response?.data?.response || "I have processed your request.";
      
      // Add Bot Response to History
      set((state) => {
           const history = state.histories[state.activeContext] || [];
           return {
               histories: {
                   ...state.histories,
                   [state.activeContext]: [
                       ...history,
                       { type: 'ai', text: botResponseText, timestamp: new Date() }
                   ]
               },
               isSending: false
           }
      });

      return response;
    } catch (error) {
       // Add Error Message to History
       set((state) => {
           const history = state.histories[state.activeContext] || [];
           return {
               histories: {
                   ...state.histories,
                   [state.activeContext]: [
                       ...history,
                       { type: 'ai', text: "Sorry, I encountered an error. Please try again.", timestamp: new Date(), isError: true }
                   ]
               },
               error: error.message,
               isSending: false
           }
       });
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
