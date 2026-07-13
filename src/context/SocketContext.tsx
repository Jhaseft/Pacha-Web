'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { SOCKET_URL } from '@/lib/callsApi';
import { useAuth } from './AuthContext';

/**
 * Una única conexión WebSocket para toda la app. Se conecta cuando hay un
 * usuario autenticado y se registra (`register`) en cada (re)conexión, de modo
 * que el usuario queda en su sala `user_<id>` para recibir mensajes y llamadas.
 *
 * Antes cada feature (mensajes, llamadas salientes, llamadas entrantes) abría su
 * propio socket y emitía `register` por separado; eso provocaba carreras en la
 * entrega de eventos por sala. Con una sola conexión compartida se elimina.
 */
const SocketCtx = createContext<Socket | null>(null);

export function SocketProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!userId) {
      setSocket(null);
      return;
    }

    const s = io(SOCKET_URL, { transports: ['websocket'] });
    const register = () => s.emit('register', userId);

    s.on('connect', register);
    if (s.connected) register();

    setSocket(s);

    return () => {
      s.off('connect', register);
      s.disconnect();
      setSocket(null);
    };
  }, [userId]);

  return <SocketCtx.Provider value={socket}>{children}</SocketCtx.Provider>;
}

/** Devuelve el socket compartido (o null si aún no hay usuario/conexión). */
export function useAppSocket(): Socket | null {
  return useContext(SocketCtx);
}
