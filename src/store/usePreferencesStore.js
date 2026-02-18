import { create } from 'zustand';
import api from '@/lib/api/api';

/**
 * Phase 1.1: User Preferences Store
 * Manages user preferences for theme, notifications, and dashboard configuration
 */
export const usePreferencesStore = create((set) => ({
  preferences: null,
  isLoading: false,
  error: null,

  // Fetch user preferences from API
  fetchPreferences: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/users/me/preferences');
      set({ preferences: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      // Return default preferences on error
      return {
        theme: 'system',
        notifications: {
          emailDigest: true,
          pushAlerts: false,
          hearingReminders: true,
        },
        dashboardConfig: {
          showActivityFeed: true,
          showAIInsights: true,
          defaultView: 'classic',
        },
      };
    }
  },

  // Update user preferences
  updatePreferences: async (updates) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch('/users/me/preferences', updates);
      set({ preferences: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Optimistic update for immediate UI feedback
  setPreferencesOptimistic: (updates) => {
    set((state) => ({
      preferences: { ...state.preferences, ...updates },
    }));
  },
}));
