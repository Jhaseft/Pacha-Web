'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onMessage, type MessagePayload } from 'firebase/messaging';
import { X } from 'lucide-react';
import { getMessagingIfSupported } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';

interface Toast {
  id: number;
  title: string;
  body: string;
  url: string;
}

// A dónde lleva cada tipo al pulsar el aviso (mismo mapa que el service worker).
function targetUrl(data: Record<string, string>): string {
  switch (data.type) {
    case 'NEW_MESSAGE':
    case 'NEW_LOCKED_MESSAGE':
    case 'MESSAGE_UNLOCKED':
    case 'IMAGE_UNLOCKED':
      return data.conversationId ? `/dashboard/chats/${data.conversationId}` : '/dashboard/chats';
    case 'WITHDRAWAL_APPROVED':
    case 'WITHDRAWAL_REJECTED':
      return '/dashboard/anfitriona/withdrawal-requests';
    case 'NEW_WITHDRAWAL_REQUEST':
      return '/admin/withdrawalRequest';
    default:
      return '/dashboard';
  }
}

/**
 * Avisos con la pestaña abierta. Firebase no muestra nada en primer plano, así
 * que lo pintamos nosotros — igual que el móvil hace con su Toast.
 */
export default function PushNotificationsProvider() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    if (!isAuthenticated) return;
    let unsubscribe: (() => void) | undefined;

    getMessagingIfSupported().then((messaging) => {
      if (!messaging) return;

      unsubscribe = onMessage(messaging, (payload: MessagePayload) => {
        const data = (payload.data ?? {}) as Record<string, string>;
        const url = targetUrl(data);

        // Silencios (mismas reglas que el móvil):
        // - el chat que ya estás mirando no necesita aviso
        // - la llamada entrante ya la muestra el socket (IncomingCallProvider)
        if (data.conversationId && pathname === `/dashboard/chats/${data.conversationId}`) return;
        if (data.type === 'INCOMING_CALL' || data.type === 'CALL_WARNING') return;

        const toast: Toast = {
          id: Date.now(),
          title: payload.notification?.title ?? 'Notificación',
          body: payload.notification?.body ?? '',
          url,
        };

        setToasts((prev) => [...prev, toast]);
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== toast.id));
        }, 6000);
      });
    });

    return () => unsubscribe?.();
  }, [isAuthenticated, pathname]);

  if (!toasts.length) return null;

  return (
    <div className="fixed top-4 right-4 z-100 flex flex-col gap-2 w-[min(22rem,calc(100vw-2rem))]">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          onClick={() => {
            router.push(toast.url);
            setToasts((prev) => prev.filter((t) => t.id !== toast.id));
          }}
          className="cursor-pointer rounded-2xl border border-line bg-card shadow-xl px-4 py-3 flex items-start gap-3 animate-in"
        >
          <div className="min-w-0 flex-1">
            <p className="text-ink font-bold text-sm truncate">{toast.title}</p>
            {toast.body && <p className="text-ink-faint text-xs mt-0.5 line-clamp-2">{toast.body}</p>}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setToasts((prev) => prev.filter((t) => t.id !== toast.id));
            }}
            aria-label="Cerrar"
            className="shrink-0 text-ink-faint hover:text-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
