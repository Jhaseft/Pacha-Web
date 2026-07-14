'use client';

import { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { isAppRoute } from '@/lib/isAppRoute';
import { usePathname } from 'next/navigation';

const DISMISSED_KEY = 'pacha.pushPromptDismissed';

/**
 * Aviso propio para pedir las notificaciones tras iniciar sesión.
 *
 * No lanzamos el cartel del navegador automáticamente: requestPermission() exige
 * un gesto del usuario, y un "Bloquear" es irreversible desde código. Preguntamos
 * antes con nuestra propia UI; el clic en "Activar" es lo que dispara el permiso.
 */
export default function PushOptInPrompt() {
  const { isAuthenticated } = useAuth();
  const pathname = usePathname();
  const push = usePushNotifications();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISSED_KEY) === '1');
  }, []);

  const visible =
    isAuthenticated &&
    isAppRoute(pathname) &&
    push.isSupported &&
    push.permission === 'default' &&
    !dismissed;

  if (!visible) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  const accept = async () => {
    await push.enable();
    // Aceptado o bloqueado, la pregunta ya no aplica: el permiso deja de ser 'default'.
    localStorage.setItem(DISMISSED_KEY, '1');
    setDismissed(true);
  };

  return (
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(26rem,calc(100vw-2rem))]">
      <div className="bg-card border border-line rounded-2xl shadow-2xl p-4 flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-brand-soft flex items-center justify-center shrink-0">
          <Bell size={20} className="text-brand" />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-ink font-bold text-sm">Activa las notificaciones</p>
          <p className="text-ink-faint text-xs mt-0.5">
            Te avisamos cuando recibas mensajes o llamadas, aunque no tengas la web abierta.
          </p>

          <div className="flex gap-2 mt-3">
            <button
              onClick={accept}
              disabled={push.busy}
              className="rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold text-xs px-4 py-2 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {push.busy ? 'Activando…' : 'Activar'}
            </button>
            <button
              onClick={dismiss}
              className="rounded-xl border border-line bg-canvas-alt text-ink font-semibold text-xs px-4 py-2 hover:bg-canvas transition-colors"
            >
              Ahora no
            </button>
          </div>
        </div>

        <button
          onClick={dismiss}
          aria-label="Cerrar"
          className="shrink-0 text-ink-faint hover:text-ink transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
