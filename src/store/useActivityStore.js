import { create } from 'zustand';
import api from '@/lib/api/api';

/**
 * Phase 1.3: Activity Store
 * Manages activity feed for dashboard
 */
export const useActivityStore = create((set) => ({
  activities: [],
  stats: null,
  isLoading: false,
  error: null,

  // Fetch recent activities for current user
  fetchRecentActivities: async (limit = 10) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/activities/me/recent', { params: { limit } });
      set({ 
        activities: data.data || data, 
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { activities: [] };
    }
  },

  // Fetch activity stats for dashboard
  fetchStats: async () => {
    try {
      const { data } = await api.get('/activities/me/stats');
      set({ stats: data.data || data });
      return data;
    } catch (error) {
      console.error('Failed to fetch activity stats:', error);
      return null;
    }
  },

  // Get activities for a specific case
  fetchCaseActivities: async (caseId) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/activities/${caseId}`);
      set({ 
        activities: data.data || data, 
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { activities: [] };
    }
  },
}));
