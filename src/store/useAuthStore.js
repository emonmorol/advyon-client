import { create } from 'zustand';
import api from '@/lib/api/api';

export const useAuthStore = create((set) => ({
  user: null,
  isLoading: false,
  error: null,

  fetchProfile: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/users/me/profile');
      set({ user: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.put('/users/me/profile', userData);
      set((state) => ({ 
        user: { ...state.user, ...data }, 
        isLoading: false 
      }));
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Placeholder for logout or other auth actions
  logout: () => set({ user: null }),
}));
