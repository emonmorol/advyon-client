import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  useConversations,
  useConversationMessages,
  useSendChatMessage,
  useCreateConversation,
  useMarkChatAsRead,
} from '@/services/chat/chatService';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import useSocket from '@/hooks/useSocket';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MessageSquare,
  Send,
  Search,
  ArrowLeft,
  Check,
  CheckCheck,
  Circle,
  ShieldCheck,
} from 'lucide-react';

// ─── Helpers ───
const getInitials = (name) => {
  if (!name) return '?';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
};

const formatTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const groupMessagesByDate = (messages) => {
  const groups = {};
  messages.forEach((msg) => {
    const dateKey = formatDate(msg.createdAt);
    if (!groups[dateKey]) groups[dateKey] = [];
    groups[dateKey].push(msg);
  });
  return groups;
};

// ─── Skeleton ───
function ConversationSkeleton() {
  return (
    <div className="flex items-center gap-3 p-4 animate-pulse">
      <div className="h-12 w-12 rounded-full bg-muted" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-1/2 rounded bg-muted" />
        <div className="h-3 w-3/4 rounded bg-muted" />
      </div>
    </div>
  );
}

// ─── Conversation List Item ───
function ConversationItem({ conversation, currentUserId, isActive, onClick, isOnline }) {
  const otherUser = conversation.participants?.find(
    (p) => String(p.id) !== String(currentUserId) && String(p._id) !== String(currentUserId)
  );
  const unread = conversation.unreadCount || 0;

  return (
    <button
      onClick={() => onClick(conversation._id)}
      className={`w-full flex items-center gap-3 p-4 text-left transition-all duration-200 border-b border-border/20
        ${isActive
          ? 'bg-[hsl(var(--primary))]/10 border-l-2 border-l-[hsl(var(--teal-accent))]'
          : 'hover:bg-muted/50'
        }`}
    >
      <div className="relative">
        <Avatar className="h-12 w-12 border-2 border-border/40">
          <AvatarImage src={otherUser?.avatarUrl} alt={otherUser?.fullName} />
          <AvatarFallback className="text-sm font-semibold bg-[hsl(var(--primary))] text-primary-foreground">
            {getInitials(otherUser?.fullName || otherUser?.displayName)}
          </AvatarFallback>
        </Avatar>
        {isOnline && (
          <Circle className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 fill-emerald-500 text-emerald-500 stroke-white stroke-2" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {otherUser?.fullName || otherUser?.displayName || 'Unknown'}
          </h4>
          <span className="text-[10px] text-muted-foreground whitespace-nowrap ml-2">
            {formatTime(conversation.lastMessageAt)}
          </span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-muted-foreground truncate flex-1">
            {conversation.lastMessage || 'No messages yet'}
          </p>
          {unread > 0 && (
            <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-[hsl(var(--teal-accent))] text-white text-[10px] px-1.5">
              {unread > 99 ? '99+' : unread}
            </Badge>
          )}
        </div>
      </div>
    </button>
  );
}

// ─── Main Chat Page ───
export default function ChatPage() {
  const { conversationId: paramConvId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const socket = useSocket();

  const {
    activeConversationId,
    setActiveConversation,
    optimisticMessages,
    addOptimisticMessage,
    removeOptimisticMessage,
    typingUsers,
    setUserTyping,
    setUserStopTyping,
  } = useChatStore();

  const currentConvId = paramConvId || activeConversationId;
  const [searchTerm, setSearchTerm] = useState('');
  const [messageInput, setMessageInput] = useState('');
  const [showMobileList, setShowMobileList] = useState(!currentConvId);
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const inputRef = useRef(null);

  // ─── Data Fetching ───
  const { data: convsResponse, isLoading: convsLoading, mutate: mutateConvs } = useConversations();
  const conversations = convsResponse?.data || [];

  const { data: msgsResponse, isLoading: msgsLoading, mutate: mutateMsgs } = useConversationMessages(currentConvId);
  const messages = msgsResponse?.data?.messages || [];

  const { trigger: sendMsg } = useSendChatMessage(currentConvId);
  const { trigger: markRead } = useMarkChatAsRead(currentConvId);

  // Combined messages (server + optimistic)
  const allMessages = useMemo(() => {
    const serverMsgs = messages || [];
    const optimistic = optimisticMessages.filter(
      (m) => m.conversationId === currentConvId
    );
    return [...serverMsgs, ...optimistic];
  }, [messages, optimisticMessages, currentConvId]);

  // ─── Active Conversation Details ───
  const activeConversation = conversations.find((c) => c._id === currentConvId);
  const otherUser = activeConversation?.participants?.find(
    (p) => String(p.id) !== String(user?.id) && String(p._id) !== String(user?._id)
  );

  // ─── Socket Events ───
  useEffect(() => {
    if (!socket.isConnected) return;

    // Join conversation room
    if (currentConvId) {
      socket.emit('chat:join', currentConvId);
    }

    // Listen for new messages
    const unsubMsg = socket.on('chat:message', (data) => {
      if (data.conversationId === currentConvId) {
        mutateMsgs(); // Refresh messages
      }
      mutateConvs(); // Refresh conversation list for last message / unread
    });

    // Listen for typing
    const unsubTyping = socket.on('chat:typing', (data) => {
      if (data.userId !== user?.id) {
        setUserTyping(data.conversationId, data.userId);
      }
    });

    const unsubStopTyping = socket.on('chat:stop-typing', (data) => {
      if (data.userId !== user?.id) {
        setUserStopTyping(data.conversationId, data.userId);
      }
    });

    // Listen for read receipts
    const unsubRead = socket.on('chat:read', (data) => {
      if (data.conversationId === currentConvId) {
        mutateMsgs();
      }
    });

    return () => {
      if (currentConvId) {
        socket.emit('chat:leave', currentConvId);
      }
      unsubMsg();
      unsubTyping();
      unsubStopTyping();
      unsubRead();
    };
  }, [socket.isConnected, currentConvId, user?.id]);

  // ─── Auto-scroll to bottom ───
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allMessages.length]);

  // ─── Mark as read when viewing ───
  useEffect(() => {
    if (currentConvId && markRead) {
      markRead({}).catch(() => {});
    }
  }, [currentConvId, markRead]);

  // ─── Sync URL param ───
  useEffect(() => {
    if (paramConvId) {
      setActiveConversation(paramConvId);
      setShowMobileList(false);
    }
  }, [paramConvId]);

  // ─── Send Message ───
  const handleSend = useCallback(async () => {
    const content = messageInput.trim();
    if (!content || !currentConvId) return;

    const tempId = `temp-${Date.now()}`;
    setMessageInput('');

    // Optimistic update
    addOptimisticMessage({
      _tempId: tempId,
      conversationId: currentConvId,
      senderId: { _id: user?._id, id: user?.id, fullName: user?.fullName, avatarUrl: user?.avatarUrl },
      content,
      status: 'sent',
      createdAt: new Date().toISOString(),
      _isOptimistic: true,
    });

    // Stop typing
    socket.emit('chat:stop-typing', { conversationId: currentConvId });

    try {
      await sendMsg({ content });
      removeOptimisticMessage(tempId);
      mutateMsgs();
      mutateConvs();
    } catch (err) {
      console.error('Failed to send message:', err);
      removeOptimisticMessage(tempId);
    }

    inputRef.current?.focus();
  }, [messageInput, currentConvId, user, sendMsg]);

  // ─── Typing Indicator ───
  const handleInputChange = (e) => {
    setMessageInput(e.target.value);

    if (currentConvId && socket.isConnected) {
      socket.emit('chat:typing', { conversationId: currentConvId });

      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => {
        socket.emit('chat:stop-typing', { conversationId: currentConvId });
      }, 2000);
    }
  };

  // ─── Key handler ───
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ─── Select conversation ───
  const selectConversation = (convId) => {
    navigate(`/dashboard/chat/${convId}`);
    setActiveConversation(convId);
    setShowMobileList(false);
  };

  // ─── Filtered conversations ───
  const filteredConversations = useMemo(() => {
    if (!searchTerm) return conversations;
    return conversations.filter((c) => {
      const other = c.participants?.find((p) => String(p.id) !== String(user?.id) && String(p._id) !== String(user?._id));
      const name = (other?.fullName || other?.displayName || '').toLowerCase();
      return name.includes(searchTerm.toLowerCase());
    });
  }, [conversations, searchTerm, user]);

  // ─── Typing users for current conversation ───
  const currentTyping = typingUsers[currentConvId] || [];

  const cardStyle = 'border-border/40 bg-card backdrop-blur-sm shadow-xl transition-all bg-background';

  // ─── Grouped messages ───
  const groupedMessages = useMemo(() => groupMessagesByDate(allMessages), [allMessages]);

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-500 h-[calc(100vh-4rem)]">
      {/* Page Header */}
      <div className="relative overflow-hidden rounded-2xl gradient-teal-depth p-6 md:p-8 mb-6">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[hsl(var(--teal-bright))] rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        </div>
        <div className="relative z-10 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
            <MessageSquare className="h-7 w-7 text-[hsl(var(--amber-glow))]" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white">
              {user?.role === 'lawyer' ? 'Client Messages' : 'Lawyer Messages'}
            </h1>
            <p className="text-white/70 mt-0.5 text-sm">
              {user?.role === 'lawyer'
                ? 'Chat with your clients in real-time'
                : 'Chat with your lawyers in real-time'}
            </p>
          </div>
        </div>
      </div>

      {/* Chat Layout */}
      <div className="flex gap-4 h-[calc(100vh-16rem)]">
        {/* ─── Left Panel: Conversation List ─── */}
        <Card
          className={`${cardStyle} rounded-2xl overflow-hidden flex-col w-full md:w-80 lg:w-96 flex-shrink-0
            ${showMobileList ? 'flex' : 'hidden md:flex'}`}
        >
          {/* Search */}
          <div className="p-4 border-b border-border/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search conversations..."
                className="pl-10 h-10 bg-muted/30 border-border/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {convsLoading ? (
              <>
                <ConversationSkeleton />
                <ConversationSkeleton />
                <ConversationSkeleton />
              </>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => (
                <ConversationItem
                  key={conv._id}
                  conversation={conv}
                  currentUserId={user?.id}
                  isActive={conv._id === currentConvId}
                  onClick={selectConversation}
                  isOnline={socket.isConnected && false /* TODO: track per-user */}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center px-4">
                <MessageSquare className="h-12 w-12 text-muted-foreground/30 mb-4" />
                <h3 className="text-sm font-semibold text-foreground mb-1">No Conversations</h3>
                <p className="text-xs text-muted-foreground">
                  {searchTerm
                    ? 'No conversations match your search'
                    : user?.role === 'lawyer'
                      ? 'Conversations with your clients will appear here'
                      : 'Start a chat from the Find Lawyers page'}
                </p>
              </div>
            )}
          </div>
        </Card>

        {/* ─── Right Panel: Active Chat ─── */}
        <Card
          className={`${cardStyle} rounded-2xl overflow-hidden flex-col flex-1
            ${!showMobileList ? 'flex' : 'hidden md:flex'}`}
        >
          {currentConvId && activeConversation ? (
            <>
              {/* Chat Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border/30">
                <button
                  className="md:hidden p-1 rounded-lg hover:bg-muted/50"
                  onClick={() => {
                    setShowMobileList(true);
                    navigate('/dashboard/chat');
                  }}
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <Avatar className="h-10 w-10 border-2 border-border/40">
                  <AvatarImage src={otherUser?.avatarUrl} alt={otherUser?.fullName} />
                  <AvatarFallback className="text-sm font-semibold bg-[hsl(var(--primary))] text-primary-foreground">
                    {getInitials(otherUser?.fullName || otherUser?.displayName)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">
                    {otherUser?.fullName || otherUser?.displayName || 'Unknown'}
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    {currentTyping.length > 0 ? (
                      <span className="text-[hsl(var(--teal-accent))] animate-pulse">Typing...</span>
                    ) : otherUser?.role ? (
                      otherUser.role.charAt(0).toUpperCase() + otherUser.role.slice(1)
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {msgsLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-8 w-8 border-2 border-[hsl(var(--teal-accent))] border-t-transparent rounded-full" />
                  </div>
                ) : allMessages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <MessageSquare className="h-16 w-16 text-muted-foreground/20 mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-1">Start the conversation</h3>
                    <p className="text-sm text-muted-foreground">Send a message to begin chatting</p>
                  </div>
                ) : (
                  Object.entries(groupedMessages).map(([dateLabel, msgs]) => (
                    <div key={dateLabel}>
                      {/* Date separator */}
                      <div className="flex items-center gap-3 my-4">
                        <div className="flex-1 h-px bg-border/30" />
                        <span className="text-[10px] text-muted-foreground font-medium px-2 py-1 rounded-full bg-muted/50">
                          {dateLabel}
                        </span>
                        <div className="flex-1 h-px bg-border/30" />
                      </div>

                      {msgs.map((msg, idx) => {
                        const isMine =
                          msg.senderId?.id === user?.id ||
                          msg.senderId?._id === user?._id ||
                          msg.senderId === user?._id;

                        return (
                          <div
                            key={msg._id || msg._tempId || idx}
                            className={`flex mb-3 ${isMine ? 'justify-end' : 'justify-start'}`}
                          >
                            {/* Other user avatar */}
                            {!isMine && (
                              <Avatar className="h-8 w-8 mr-2 mt-auto flex-shrink-0">
                                <AvatarImage src={msg.senderId?.avatarUrl} />
                                <AvatarFallback className="text-xs bg-muted">
                                  {getInitials(msg.senderId?.fullName)}
                                </AvatarFallback>
                              </Avatar>
                            )}

                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${
                                isMine
                                  ? 'gradient-teal-depth text-white rounded-br-md'
                                  : 'bg-muted/60 text-foreground rounded-bl-md'
                              } ${msg._isOptimistic ? 'opacity-70' : ''}`}
                            >
                              <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
                                {msg.content}
                              </p>
                              <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : ''}`}>
                                <span className={`text-[10px] ${isMine ? 'text-white/60' : 'text-muted-foreground'}`}>
                                  {formatTime(msg.createdAt)}
                                </span>
                                {isMine && (
                                  msg.status === 'read' ? (
                                    <CheckCheck className="h-3 w-3 text-white/80" />
                                  ) : (
                                    <Check className="h-3 w-3 text-white/50" />
                                  )
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))
                )}

                {/* Typing indicator */}
                {currentTyping.length > 0 && (
                  <div className="flex items-center gap-2 px-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <span className="text-xs text-muted-foreground">typing...</span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border/30">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type a message..."
                    className="flex-1 h-11 bg-muted/30 border-border/30 focus-visible:ring-[hsl(var(--teal-accent))]"
                    value={messageInput}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    autoFocus
                  />
                  <Button
                    onClick={handleSend}
                    disabled={!messageInput.trim()}
                    className="h-11 w-11 p-0 gradient-teal-depth text-white hover:opacity-90 transition-opacity rounded-xl"
                  >
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            /* Empty state — no conversation selected */
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <div className="p-6 rounded-2xl bg-muted/30 mb-6">
                <MessageSquare className="h-16 w-16 text-muted-foreground/30" />
              </div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Your Messages</h2>
              <p className="text-sm text-muted-foreground max-w-xs">
                {user?.role === 'lawyer'
                  ? 'Select a conversation from the list to chat with your client.'
                  : 'Select a conversation from the list or start a new chat from the Find Lawyers page.'}
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
