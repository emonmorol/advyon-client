import { create } from 'zustand';
import api from '@/lib/api/api';

const extractErrorMessage = (error, fallback) =>
  error?.response?.data?.message || error?.message || fallback;

export const useAIStore = create((set) => ({
  histories: {
    global: [],
  },
  activeContext: 'global',
  isSending: false,
  error: null,

  // Chat/document analysis
  analysisResult: null,
  isAnalyzing: false,

  // Dashboard AI insights
  myInsights: [],
  dashboardSummary: null,
  isLoadingInsights: false,

  // AI tools state
  toolHistory: [],
  toolHistoryMeta: {
    page: 1,
    limit: 20,
    total: 0,
    totalPage: 0,
  },
  toolExecutionResult: null,
  toolUsage: {
    todayCount: 0,
    dailyLimit: 0,
  },
  isRunningTool: false,
  isLoadingToolHistory: false,

  setContext: (contextKey) => set({ activeContext: contextKey }),

  getHistory: () => {
    const state = useAIStore.getState();
    return state.histories[state.activeContext] || [];
  },

  addMessage: (message, type = 'user') =>
    set((state) => {
      const currentHistory = state.histories[state.activeContext] || [];
      return {
        histories: {
          ...state.histories,
          [state.activeContext]: [
            ...currentHistory,
            { ...message, timestamp: new Date(), type },
          ],
        },
      };
    }),

  sendMessage: async (caseId, message, context = {}) => {
    set({ isSending: true, error: null });
    const state = useAIStore.getState();
    const currentHistory = state.histories[state.activeContext] || [];

    try {
      const apiHistory = currentHistory.map((h) => ({
        role: h.type === 'ai' ? 'assistant' : 'user',
        content: h.text,
      }));

      const payload = {
        caseId: caseId !== 'general' ? caseId : undefined,
        message,
        history: apiHistory,
      };

      if (
        context.documentIds &&
        Array.isArray(context.documentIds) &&
        context.documentIds.length > 0
      ) {
        payload.documentIds = context.documentIds;
      } else if (context.documentId) {
        payload.documentId = context.documentId;
      }

      const { data: response } = await api.post('/ai/chat', payload);
      const botResponseText =
        response?.data?.response || 'I have processed your request.';

      set((snapshot) => {
        const history = snapshot.histories[snapshot.activeContext] || [];
        return {
          histories: {
            ...snapshot.histories,
            [snapshot.activeContext]: [
              ...history,
              { type: 'ai', text: botResponseText, timestamp: new Date() },
            ],
          },
          isSending: false,
        };
      });

      return response;
    } catch (error) {
      const messageText = extractErrorMessage(
        error,
        'Sorry, I encountered an error. Please try again.',
      );

      set((snapshot) => {
        const history = snapshot.histories[snapshot.activeContext] || [];
        return {
          histories: {
            ...snapshot.histories,
            [snapshot.activeContext]: [
              ...history,
              {
                type: 'ai',
                text: messageText,
                timestamp: new Date(),
                isError: true,
              },
            ],
          },
          error: messageText,
          isSending: false,
        };
      });

      throw error;
    }
  },

  analyzeDocument: async (documentId) => {
    set({ isAnalyzing: true, error: null });
    try {
      const { data: response } = await api.post('/ai/documents/analyze', {
        documentId,
      });
      set({ analysisResult: response, isAnalyzing: false });
      return response;
    } catch (error) {
      set({
        error: extractErrorMessage(error, 'Failed to analyze document'),
        isAnalyzing: false,
      });
      throw error;
    }
  },

  fetchMyInsights: async (limit = 5) => {
    set({ isLoadingInsights: true });
    try {
      const { data } = await api.get('/ai-insights/me', { params: { limit } });
      set({
        myInsights: data.data || data,
        isLoadingInsights: false,
      });
      return data;
    } catch (error) {
      console.error('Failed to fetch insights:', error);
      set({ isLoadingInsights: false });
      return { data: [] };
    }
  },

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

  runTool: async (toolKey, input, options = {}) => {
    set({ isRunningTool: true, error: null });
    try {
      const payload = {
        input,
        caseId: options.caseId,
        documentId: options.documentId,
        documentIds: options.documentIds,
        history: options.history || [],
      };

      const { data } = await api.post(`/ai/tools/${toolKey}/run`, payload);
      const result = data?.data || data;

      set({
        toolExecutionResult: result,
        toolUsage: result?.usage || { todayCount: 0, dailyLimit: 0 },
        isRunningTool: false,
      });

      return result;
    } catch (error) {
      set({
        isRunningTool: false,
        error: extractErrorMessage(error, 'Failed to run AI tool'),
      });
      throw error;
    }
  },

  fetchToolHistory: async (params = {}) => {
    set({ isLoadingToolHistory: true, error: null });
    try {
      const { data } = await api.get('/ai/tools/history', { params });
      set({
        toolHistory: data?.data || [],
        toolHistoryMeta: data?.meta || {
          page: 1,
          limit: 20,
          total: 0,
          totalPage: 0,
        },
        isLoadingToolHistory: false,
      });

      return data;
    } catch (error) {
      set({
        isLoadingToolHistory: false,
        error: extractErrorMessage(error, 'Failed to load AI tool history'),
      });
      throw error;
    }
  },

  exportToolHistory: async (format = 'json', toolKey) => {
    try {
      const { data, headers } = await api.get('/ai/tools/history/export', {
        params: {
          format,
          ...(toolKey ? { toolKey } : {}),
        },
        responseType: 'blob',
      });

      return {
        blob: data,
        contentType: headers['content-type'] || 'application/octet-stream',
      };
    } catch (error) {
      set({ error: extractErrorMessage(error, 'Failed to export AI history') });
      throw error;
    }
  },
}));

