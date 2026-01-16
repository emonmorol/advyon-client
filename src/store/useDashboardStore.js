import { create } from 'zustand';
import api from '@/lib/api/api';

export const useDashboardStore = create((set) => ({
  stats: null,
  unified: null, // Phase 1.5: Unified dashboard data
  isLoading: false,
  error: null,

  // Legacy stats endpoint
  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/dashboard/stats');
      set({ stats: data.data || data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Phase 1.5: Unified Dashboard Endpoint - fetches everything in one call
  fetchUnifiedDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/dashboard/unified');
      const dashboardData = data.data || data;
      
      set({ 
        unified: dashboardData,
        stats: dashboardData.stats,
        isLoading: false 
      });
      
      return dashboardData;
    } catch (error) {
      console.error('Failed to fetch unified dashboard:', error);
      set({ error: error.message, isLoading: false });
      return null;
    }
  },
}));
