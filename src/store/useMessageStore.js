import { create } from 'zustand';
import api from '@/lib/api/api';

/**
 * Phase 1.2: Message Store
 * Manages client messages/requests for the dashboard
 */
export const useMessageStore = create((set) => ({
  messages: [],
  pendingCount: 0,
  isLoading: false,
  error: null,
  meta: null,

  // Fetch messages with optional filters
  fetchMessages: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/messages', { params });
      set({ 
        messages: data.data || data, 
        meta: data.meta,
        isLoading: false 
      });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      return { messages: [] };
    }
  },

  // Fetch pending/unread count
  fetchPendingCount: async () => {
    try {
      const { data } = await api.get('/messages/pending-count');
      set({ pendingCount: data.count || 0 });
      return data.count;
    } catch (error) {
      console.error('Failed to fetch pending count:', error);
      return 0;
    }
  },

  // Mark message as read
  markAsRead: async (messageId) => {
    try {
      await api.patch(`/messages/${messageId}/read`);
      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === messageId ? { ...msg, status: 'read', readAt: new Date() } : msg
        ),
        pendingCount: Math.max(0, state.pendingCount - 1),
      }));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  },

  // Archive a message
  archiveMessage: async (messageId) => {
    try {
      await api.patch(`/messages/${messageId}/archive`);
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== messageId),
      }));
    } catch (error) {
      console.error('Failed to archive message:', error);
    }
  },

  // Send a new message
  sendMessage: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/messages', payload);
      set((state) => ({
        messages: [data, ...state.messages],
        isLoading: false,
      }));
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },
}));
