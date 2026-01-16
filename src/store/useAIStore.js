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

  // Phase 1.4: AI Insights for Dashboard
  myInsights: [],
  dashboardSummary: null,
  isLoadingInsights: false,

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

    try {
        // Construct history for API (last 10) - Backend also slices, but good to be safe
       const apiHistory = currentHistory.map(h => ({ role: h.type, content: h.text }));
    
      const payload = {
        caseId: caseId !== 'general' ? caseId : undefined,
        message,
        history: apiHistory,
      };
      
      // If we have document context, attach it
      if (context.documentIds && Array.isArray(context.documentIds) && context.documentIds.length > 0) {
        payload.documentIds = context.documentIds;
      } else if (context.documentId) {
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
  },

  // Phase 1.4: Fetch user's AI insights for dashboard
  fetchMyInsights: async (limit = 5) => {
    set({ isLoadingInsights: true });
    try {
      const { data } = await api.get('/ai-insights/me', { params: { limit } });
      set({ 
        myInsights: data.data || data, 
        isLoadingInsights: false 
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      set({ isLoadingInsights: false });
      return { data: [] };
    }
  },

  // Phase 1.4: Fetch dashboard AI summary
  fetchDashboardSummary: async () => {
    try {
      const { data } = await api.get('/ai-insights/dashboard/summary');
      set({ dashboardSummary: data.data || data });
      return data;
    } catch (error) {
      console.error('Failed to fetch dashboard summary:', error);
      return null;
    }
  },
}));

