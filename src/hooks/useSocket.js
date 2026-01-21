import { useEffect, useRef, useCallback, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/useAuthStore';

/**
 * Phase 8.5: useSocket Hook
 * Manages WebSocket connection for real-time updates
 */

const SOCKET_EVENTS = {
  CASE_UPDATED: 'case:updated',
  MSG_RECEIVED: 'message:received',
  ANALYSIS_COMPLETE: 'analysis:complete',
  STATS_UPDATED: 'stats:updated',
  NOTIFICATION: 'notification:new',
  JOIN_CASE: 'case:join',
  LEAVE_CASE: 'case:leave',
};

const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:5000';

export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const { token, user } = useAuthStore();

  useEffect(() => {
    if (!token) return;

    // Initialize socket connection with auth token
    socketRef.current = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on('connect', () => {
      console.log('[Socket] Connected');
      setIsConnected(true);
    });

    socketRef.current.on('disconnect', () => {
      console.log('[Socket] Disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('connect_error', (error) => {
      console.error('[Socket] Connection error:', error.message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [token]);

  // Subscribe to an event
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
    return () => {
      if (socketRef.current) {
        socketRef.current.off(event, callback);
      }
    };
  }, []);

  // Emit an event
  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  // Join a case room
  const joinCase = useCallback((caseId) => {
    emit(SOCKET_EVENTS.JOIN_CASE, caseId);
  }, [emit]);

  // Leave a case room
  const leaveCase = useCallback((caseId) => {
    emit(SOCKET_EVENTS.LEAVE_CASE, caseId);
  }, [emit]);

  return {
    socket: socketRef.current,
    isConnected,
    on,
    emit,
    joinCase,
    leaveCase,
    SOCKET_EVENTS,
  };
};

export default useSocket;
