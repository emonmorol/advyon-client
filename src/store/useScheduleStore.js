import { create } from 'zustand';
import api from '@/lib/api/api';

/**
 * Phase 4: Schedule Store
 * Manages calendar events and court dates
 */
export const useScheduleStore = create((set) => ({
  events: [],
  todayEvents: [],
  selectedEvent: null,
  isLoading: false,
  error: null,

  // Fetch all events with filters
  fetchEvents: async (filters = {}) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/schedules', { params: filters });
      set({ events: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch events for today (Phase 4)
  fetchTodayEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/schedules/today');
      set({ todayEvents: data, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch single event by ID for modal view
  getEventById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/schedules/${id}`);
      set({ selectedEvent: data, isLoading: false });
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  },

  // Clear selected event (when closing modal)
  clearSelectedEvent: () => set({ selectedEvent: null }),

  createEvent: async (eventData) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post('/schedules', eventData);
      set((state) => ({ 
        events: [...state.events, data],
        isLoading: false 
      }));
      return data;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

