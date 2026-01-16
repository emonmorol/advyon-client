import { create } from 'zustand';
import api from '@/lib/api/api';

export const useDashboardStore = create((set) => ({
  stats: null,
  isLoading: false,
  error: null,

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/dashboard/stats');
      set({ stats: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },
}));
