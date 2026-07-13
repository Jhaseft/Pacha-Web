'use client';

import { useMemo } from 'react';
import { useAppSocket } from '@/context/SocketContext';
import type { Message } from '@/lib/messages';

export interface UserPresenceEvent {
  userId: string;
  isOnline: boolean;
  lastActiveAt: string | null;
}

/**
 * Mensajería en tiempo real sobre la conexión compartida (SocketProvider).
 * Expone suscriptores para mensajes entrantes y presencia. `socket` se expone
 * para que los efectos dependan de su disponibilidad.
 */
export function useMessageSocket() {
  const socket = useAppSocket();

  return useMemo(
    () => ({
      socket,
      onNewMessage(cb: (msg: Message) => void) {
        socket?.on('new_message', cb);
        return () => socket?.off('new_message', cb);
      },
      onUserPresence(cb: (event: UserPresenceEvent) => void) {
        socket?.on('user_presence', cb);
        return () => socket?.off('user_presence', cb);
      },
    }),
    [socket],
  );
}
