'use client';

import { useCallback, useEffect, useState } from 'react';
import { getToken, deleteToken } from 'firebase/messaging';
import { getMessagingIfSupported, VAPID_KEY } from '@/lib/firebase';
import { apiRegisterWebPush, apiRemoveWebPush } from '@/lib/pushCredentials';
import { useAuth } from '@/context/AuthContext';

const TOKEN_KEY = 'pacha.pushToken';

type PermissionState = 'default' | 'granted' | 'denied' | 'unsupported';

const FIREBASE_DBS = [
  'firebase-messaging-database',
  // La instalación (token FIS) se guarda aparte. Si el origen se reutilizó con
  // otro proyecto Firebase — típico en localhost —, aquí queda una instalación
  // ajena; el SDK la reenvía y FCM la rechaza con 401.
  'firebase-installations-database',
  'firebase-installations-store',
  'firebase-heartbeat-database',
];

/**
 * Deja el navegador sin rastro de push: cancela la suscripción actual, quita los
 * service workers y borra las bases donde Firebase cachea token e instalación.
 */
async function clearPushState() {
  const registrations = await navigator.serviceWorker.getRegistrations();
  for (const registration of registrations) {
    const subscription = await registration.pushManager.getSubscription();
    await subscription?.unsubscribe().catch(() => {});
    await registration.unregister().catch(() => {});
  }

  await Promise.all(
    FIREBASE_DBS.map(
      (name) =>
        new Promise<void>((resolve) => {
          const request = indexedDB.deleteDatabase(name);
          request.onsuccess = () => resolve();
          request.onerror = () => resolve();
          request.onblocked = () => resolve();
        }),
    ),
  );
}

export function usePushNotifications() {
  const { isAuthenticated } = useAuth();
  const [permission, setPermission] = useState<PermissionState>('default');
  const [registered, setRegistered] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setRegistered(!!localStorage.getItem(TOKEN_KEY));
    getMessagingIfSupported().then((messaging) => {
      if (!messaging) {
        setPermission('unsupported');
        return;
      }
      setPermission(Notification.permission as PermissionState);
    });
  }, []);

  // Obtiene el token de este navegador y lo registra en el backend.
  const registerToken = useCallback(async () => {
    const messaging = await getMessagingIfSupported();
    if (!messaging) throw new Error('Este navegador no admite notificaciones.');

    const fetchToken = async () => {
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      await navigator.serviceWorker.ready;
      return getToken(messaging, {
        vapidKey: VAPID_KEY,
        serviceWorkerRegistration: registration,
      });
    };

    let token: string | null = null;
    try {
      token = await fetchToken();
    } catch (e) {
      // Un origen reutilizado (típico en localhost) puede conservar una
      // suscripción push creada con otra VAPID key u otro proyecto Firebase.
      // getToken intenta reutilizarla y Google la rechaza (401). La tiramos y
      // reintentamos desde cero.
      console.warn('[push] reintentando tras limpiar la suscripción previa:', e);
      await clearPushState();
      token = await fetchToken();
    }

    if (!token) throw new Error('Firebase no devolvió token.');

    // Si el token rotó (o se regeneró tras una limpieza), el anterior queda
    // huérfano en el backend y este navegador recibiría avisos duplicados.
    const previous = localStorage.getItem(TOKEN_KEY);
    if (previous && previous !== token) {
      await apiRemoveWebPush(previous).catch(() => {});
    }

    await apiRegisterWebPush(token);
    localStorage.setItem(TOKEN_KEY, token);
    setRegistered(true);
    return token;
  }, []);

  // Pide permiso al usuario (solo se puede desde un gesto suyo: un clic).
  const enable = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await Notification.requestPermission();
      setPermission(result as PermissionState);
      if (result !== 'granted') return false;

      await registerToken();
      return true;
    } catch (e) {
      // Los fallos aquí son de configuración (APIs de Firebase, VAPID, service
      // worker): sin este log el interruptor parecería no hacer nada.
      console.error('[push] no se pudo activar:', e);
      setError(e instanceof Error ? e.message : 'No se pudieron activar las notificaciones.');
      return false;
    } finally {
      setBusy(false);
    }
  }, [registerToken]);

  // El navegador no deja revocar el permiso por código (eso se hace desde la
  // barra de direcciones), pero sí podemos dejar de enviar a este dispositivo.
  const disable = useCallback(async () => {
    setBusy(true);
    setError(null);
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      if (token) {
        await apiRemoveWebPush(token).catch(() => {});
        localStorage.removeItem(TOKEN_KEY);
      }
      const messaging = await getMessagingIfSupported();
      if (messaging) await deleteToken(messaging).catch(() => {});
      setRegistered(false);
      return true;
    } finally {
      setBusy(false);
    }
  }, []);

  // Con sesión y permiso concedido pero sin token registrado (o para refrescar
  // uno que pudo rotar), registra en silencio al arrancar.
  useEffect(() => {
    if (!isAuthenticated || permission !== 'granted') return;
    registerToken().catch((e) => console.error('[push] registro automático falló:', e));
  }, [isAuthenticated, permission, registerToken]);

  return {
    permission,
    busy,
    error,
    // Activado = el usuario dio permiso Y este navegador está registrado en el
    // backend. Solo con el permiso, el interruptor mentiría si el token falló.
    isEnabled: permission === 'granted' && registered,
    isSupported: permission !== 'unsupported',
    enable,
    disable,
  };
}
