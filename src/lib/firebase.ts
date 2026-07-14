import { initializeApp, getApps, getApp } from 'firebase/app';
import { getMessaging, isSupported, type Messaging } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY ?? '';

/**
 * Messaging solo existe en el navegador y no en todos: Safari/iOS solo lo
 * soporta si la web está instalada como PWA. Devuelve null cuando no aplica,
 * para que quien llame simplemente no ofrezca notificaciones.
 */
export async function getMessagingIfSupported(): Promise<Messaging | null> {
  if (typeof window === 'undefined') return null;
  if (!firebaseConfig.apiKey || !VAPID_KEY) return null;
  if (!(await isSupported())) return null;

  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  return getMessaging(app);
}
