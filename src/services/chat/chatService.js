import { useApiSWR, useApiMutation, buildUrl } from '../_shared/apiClient';

/**
 * Chat service hooks — SWR-based data fetching for conversations and messages
 */

// Fetch all conversations for the current user
export const useConversations = () => {
  return useApiSWR('/chat/conversations', {
    refreshInterval: 10000, // Poll every 10s for new conversations
  });
};

// Fetch messages for a specific conversation
export const useConversationMessages = (conversationId, params = {}) => {
  const url = conversationId
    ? buildUrl(`/chat/conversations/${conversationId}/messages`, params)
    : null;
  return useApiSWR(url);
};

// Mutation: create or get a conversation
export const useCreateConversation = () => {
  return useApiMutation('/chat/conversations', 'post');
};

// Mutation: send a message  
export const useSendChatMessage = (conversationId) => {
  return useApiMutation(
    conversationId ? `/chat/conversations/${conversationId}/messages` : null,
    'post'
  );
};

// Mutation: mark conversation as read
export const useMarkChatAsRead = (conversationId) => {
  return useApiMutation(
    conversationId ? `/chat/conversations/${conversationId}/read` : null,
    'patch'
  );
};
