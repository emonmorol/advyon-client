import { create } from 'zustand';

/**
 * Chat Store — manages active conversation, optimistic messages, typing state
 */
export const useChatStore = create((set, get) => ({
  activeConversationId: null,
  optimisticMessages: [], // Messages not yet confirmed by server
  typingUsers: {}, // { conversationId: [userId, ...] }
  
  setActiveConversation: (id) => set({ activeConversationId: id }),

  // Add optimistic message (shown immediately before server confirms)
  addOptimisticMessage: (message) =>
    set((state) => ({
      optimisticMessages: [...state.optimisticMessages, message],
    })),

  // Remove optimistic message once server confirms
  removeOptimisticMessage: (tempId) =>
    set((state) => ({
      optimisticMessages: state.optimisticMessages.filter((m) => m._tempId !== tempId),
    })),

  clearOptimisticMessages: () => set({ optimisticMessages: [] }),

  // Typing indicators
  setUserTyping: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      if (current.includes(userId)) return state;
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...current, userId],
        },
      };
    }),

  setUserStopTyping: (conversationId, userId) =>
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: current.filter((id) => id !== userId),
        },
      };
    }),

  clearTyping: (conversationId) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: [] },
    })),
}));
