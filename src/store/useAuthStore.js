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
      set({ user: data.data || data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  updateProfile: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.patch('/users/me/profile', userData);
      const updatedUser = data.data || data;
      set((state) => ({ 
        user: { ...state.user, ...updatedUser }, 
        isLoading: false 
      }));
      return updatedUser;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  changePassword: async (currentPassword, newPassword) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/users/me/change-password', {
        currentPassword,
        newPassword,
      });
      set({ isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.response?.data?.message || error.message, isLoading: false });
      throw error;
    }
  },

  // Placeholder for logout or other auth actions
  logout: () => set({ user: null }),
}));

