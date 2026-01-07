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
      // STATIC DATA MODE: Use mock data instead of API
      // const { data } = await api.get('/community/threads');
      
      const mockData = await import('@/features/community/data/mockData.json');
      const threads = mockData.threads || mockData.default?.threads || [];
      set({ threads, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
