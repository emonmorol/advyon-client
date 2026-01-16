import { create } from 'zustand';
import api from '@/lib/api/api';

export const useCommunityStore = create((set, get) => ({
  threads: [],
  isLoading: false,
  error: null,
  meta: null, // Pagination meta

  currentThread: null,

  fetchThreads: async (params = {}) => {
    // Basic caching: If no filters are applied and we have data, don't refetch
    // This maintains the existing behavior requested.
    if (Object.keys(params).length === 0 && get().threads.length > 0) return;

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/community/threads', { params });
      set({ 
          threads: data.data, 
          meta: data.meta,
          isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  getThreadById: async (id) => {
      set({ isLoading: true, error: null, currentThread: null });
      try {
          const { data } = await api.get(`/community/threads/${id}`);
          set({ currentThread: data.data, isLoading: false });
          return data.data;
      } catch (error) {
          set({ error: error.message, isLoading: false });
      }
  },

  createThread: async (threadData) => {
      set({ isLoading: true, error: null });
      try {
          const { data } = await api.post('/community/threads', threadData);
          // Optimistic update or refetch
          set((state) => ({
              threads: [data.data, ...state.threads],
              isLoading: false
          }));
          return data.data;
      } catch (error) {
          set({ error: error.message, isLoading: false });
          throw error;
      }
  },

  voteThread: async (threadId) => {
     try {
         const { data } = await api.patch(`/community/threads/${threadId}/vote`);
         // Update local state
         set((state) => ({
             threads: state.threads.map(t => 
                 t._id === threadId || t.id === threadId // Handle both _id and id if mixed
                     ? { ...t, upvotes: data.data.upvotes } 
                     : t
             )
         }));
     } catch (error) {
         console.error("Failed to vote:", error);
     }
  }
}));
