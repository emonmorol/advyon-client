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
      // Handle wrapped response: { success, message, data: [...] }
      console.log('[ScheduleStore] Raw axios data:', data);
      console.log('[ScheduleStore] data.data:', data.data);
      console.log('[ScheduleStore] Is array?', Array.isArray(data.data));
      const eventList = data.data || data || [];
      console.log('[ScheduleStore] eventList:', eventList, 'length:', eventList.length);
      set({ events: eventList, isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch events for today (Phase 4)
  fetchTodayEvents: async () => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get('/schedules/today');
      // Handle wrapped response
      set({ todayEvents: data.data || data || [], isLoading: false });
    } catch (error) {
      set({ error: error.message, isLoading: false });
    }
  },

  // Fetch single event by ID for modal view
  getEventById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.get(`/schedules/${id}`);
      const event = data.data || data;
      set({ selectedEvent: event, isLoading: false });
      return event;
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
      const newEvent = data.data || data;
      set((state) => ({ 
        events: [...(state.events || []), newEvent],
        isLoading: false 
      }));
      return newEvent;
    } catch (error) {
      set({ error: error.message, isLoading: false });
      throw error;
    }
  }
}));

