import { create } from 'zustand';
import api from '@/lib/api/api';

/**
 * Phase 5: Analytics Store
 * Manages analytics overview data
 */
export const useAnalyticsStore = create((set) => ({
  stats: null,
  caseDistribution: [],
  upcomingDeadlines: [],
  isLoading: false,
  error: null,

  fetchAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/analytics/overview');
      set({ 
        stats: data.stats,
        caseDistribution: data.caseDistribution,
        upcomingDeadlines: data.upcomingDeadlines,
        isLoading: false 
      });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  }
}));
