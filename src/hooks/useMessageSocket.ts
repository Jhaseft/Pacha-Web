'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/callsApi';
import type { Message } from '@/lib/messages';

export interface UserPresenceEvent {
  userId: string;
  isOnline: boolean;
  lastActiveAt: string | null;
}

/**
 * WebSocket de mensajería para web — misma lógica que `useSocket` del móvil.
 * Se conecta al gateway, se registra con el userId y expone suscriptores
 * para mensajes entrantes y presencia.
 */
export function useMessageSocket(userId: string | null | undefined) {
  const socketRef = useRef<Socket | null>(null);
  const newMessageListenersRef = useRef(new Set<(msg: Message) => void>());
  const userPresenceListenersRef = useRef(new Set<(event: UserPresenceEvent) => void>());

  useEffect(() => {
    if (!userId) return;

    const socket = io(SOCKET_URL, { transports: ['websocket'] });
    socketRef.current = socket;

    for (const cb of newMessageListenersRef.current) socket.on('new_message', cb);
    for (const cb of userPresenceListenersRef.current) socket.on('user_presence', cb);

    socket.on('connect', () => {
      socket.emit('register', userId);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const onNewMessage = useCallback((callback: (msg: Message) => void) => {
    newMessageListenersRef.current.add(callback);
    socketRef.current?.on('new_message', callback);
    return () => {
      newMessageListenersRef.current.delete(callback);
      socketRef.current?.off('new_message', callback);
    };
  }, []);

  const onUserPresence = useCallback((callback: (event: UserPresenceEvent) => void) => {
    userPresenceListenersRef.current.add(callback);
    socketRef.current?.on('user_presence', callback);
    return () => {
      userPresenceListenersRef.current.delete(callback);
      socketRef.current?.off('user_presence', callback);
    };
  }, []);

  return useMemo(() => ({ onNewMessage, onUserPresence }), [onNewMessage, onUserPresence]);
}
