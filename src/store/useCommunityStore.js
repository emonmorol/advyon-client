import { create } from 'zustand';
import api from '@/lib/api/api';

export const useCommunityStore = create((set, get) => ({
  threads: [],
  isLoading: false,
  error: null,

  fetchThreads: async () => {
    if (get().threads.length > 0) return; // Cache

    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/community/threads');
      set({ threads: Array.isArray(data) ? data : [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
