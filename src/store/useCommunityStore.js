import { create } from 'zustand';
import api from '@/lib/api/api';

const BASE = '/community';

// Category mapping: UI id -> Backend category name
const CATEGORY_MAP = {
  family: 'Family Law',
  criminal: 'Criminal Defense',
  civil: 'Civil Litigation',
  property: 'Property Law',
  corporate: 'Corporate',
  ip: 'Intellectual Property',
  others: 'Others',
};

export const useCommunityStore = create((set, get) => ({
  threads: [],
  currentThread: null,
  isLoading: false,
  error: null,
  lastFetched: null,

  // Fetch all threads with optional query params
  fetchThreads: async (params = {}, force = false) => {
    const { lastFetched, isLoading } = get();

    // Cache Strategy: Don't refetch if fetched < 30 seconds ago, unless forced
    if (!force && lastFetched && Date.now() - lastFetched < 30000 && get().threads.length > 0) {
      return get().threads;
    }

    if (isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = queryString ? `${BASE}/threads?${queryString}` : `${BASE}/threads`;
      console.log('[CommunityStore] Fetching threads with URL:', url);
      const { data } = await api.get(url);
      console.log('[CommunityStore] Received data:', data);
      const threads = data?.data || [];

      set({
        threads,
        isLoading: false,
        lastFetched: Date.now()
      });
      return threads;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch threads', isLoading: false });
      console.error('Failed to fetch threads:', error);
    }
  },

  // Fetch single thread details with replies
  fetchThreadById: async (threadId) => {
    set({ isLoading: true, error: null, currentThread: null });
    try {
      const { data } = await api.get(`${BASE}/threads/${threadId}`);
      const threadData = data?.data || data;
      set({ currentThread: threadData, isLoading: false });
      return threadData;
    } catch (error) {
      set({ error: error.message || 'Failed to fetch thread', isLoading: false });
      console.error('Failed to fetch thread:', error);
      return null;
    }
  },

  // Create new thread
  createThread: async (payload) => {
    set({ isLoading: true, error: null });
    try {
      // Map UI category id to backend category name
      const backendPayload = {
        ...payload,
        category: CATEGORY_MAP[payload.category] || payload.category,
      };

      const { data } = await api.post(`${BASE}/threads`, backendPayload);
      const newThread = data?.data || data;

      // Prepend new thread to list (optimistic UI)
      set((state) => ({
        threads: [newThread, ...state.threads],
        isLoading: false,
        lastFetched: null, // Invalidate cache to force refresh
      }));

      return newThread;
    } catch (error) {
      set({ error: error.message || 'Failed to create thread', isLoading: false });
      throw error;
    }
  },

  // Vote on a thread (toggle)
  voteThread: async (threadId) => {
    const prevThreads = get().threads;

    // Optimistic update
    set((state) => ({
      threads: state.threads.map((t) =>
        (t._id === threadId || t.id === threadId)
          ? { ...t, upvotes: [...(t.upvotes || []), 'optimistic'] }
          : t
      ),
    }));

    try {
      const { data } = await api.patch(`${BASE}/threads/${threadId}/vote`);
      const updatedThread = data?.data || data;

      // Update with real data
      set((state) => ({
        threads: state.threads.map((t) =>
          (t._id === threadId || t.id === threadId) ? { ...t, upvotes: updatedThread.upvotes } : t
        ),
      }));

      return updatedThread;
    } catch (error) {
      // Rollback on error
      set({ threads: prevThreads, error: 'Failed to vote' });
      throw error;
    }
  },

  // Add reply to a thread
  addReply: async (threadId, content) => {
    set({ isLoading: true, error: null });
    try {
      const { data } = await api.post(`${BASE}/threads/${threadId}/reply`, { content });
      const newReply = data?.data || data;

      // Update current thread's replies if viewing that thread
      set((state) => {
        if (state.currentThread?.thread?._id === threadId) {
          return {
            currentThread: {
              ...state.currentThread,
              replies: [...(state.currentThread.replies || []), newReply],
            },
            isLoading: false,
          };
        }
        return { isLoading: false };
      });

      return newReply;
    } catch (error) {
      set({ error: error.message || 'Failed to add reply', isLoading: false });
      throw error;
    }
  },

  // Vote on a reply (upvote or downvote)
  voteReply: async (replyId, direction = 'up') => {
    const prevThread = get().currentThread;

    // Optimistic update
    set((state) => {
      if (!state.currentThread?.replies) return state;
      return {
        currentThread: {
          ...state.currentThread,
          replies: state.currentThread.replies.map((r) => {
            if (r._id !== replyId) return r;
            if (direction === 'up') {
              return { ...r, upvotes: [...(r.upvotes || []), 'optimistic'] };
            } else {
              return { ...r, downvotes: [...(r.downvotes || []), 'optimistic'] };
            }
          }),
        },
      };
    });

    try {
      const { data } = await api.patch(`${BASE}/replies/${replyId}/vote`, { direction });
      const updatedReply = data?.data || data;

      // Update with real data
      set((state) => {
        if (!state.currentThread?.replies) return state;
        return {
          currentThread: {
            ...state.currentThread,
            replies: state.currentThread.replies.map((r) =>
              r._id === replyId
                ? { ...r, upvotes: updatedReply.upvotes, downvotes: updatedReply.downvotes }
                : r
            ),
          },
        };
      });

      return updatedReply;
    } catch (error) {
      // Rollback on error
      set({ currentThread: prevThread, error: 'Failed to vote' });
      throw error;
    }
  },

  // Clear cache to force refresh
  clearCache: () => set({ lastFetched: null, threads: [] }),

  // Stats
  communityStats: { totalThreads: 0, activeUsers: 0 },
  fetchCommunityStats: async () => {
    try {
      const { data } = await api.get(`${BASE}/stats`);
      const stats = data?.data || data;
      set({ communityStats: stats });
    } catch (error) {
      console.error('Failed to fetch community stats:', error);
    }
  },

  // Trending Topics
  trendingTopics: [],
  fetchTrendingTopics: async (limit = 10) => {
    try {
      const { data } = await api.get(`${BASE}/trending-topics?limit=${limit}`);
      const topics = data?.data || [];
      set({ trendingTopics: topics });
    } catch (error) {
      console.error('Failed to fetch trending topics:', error);
    }
  },
}));
