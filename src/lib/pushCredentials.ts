import { apiAxios } from './apiClient';

// Registra el token FCM de este navegador. El backend hace upsert por token,
// así que llamarlo en cada arranque es idempotente.
export const apiRegisterWebPush = async (token: string): Promise<void> => {
  await apiAxios.post('/users/push-credentials', {
    token,
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
  });
};

// Al cerrar sesión o revocar el permiso: si no, este navegador seguiría
// recibiendo las notificaciones del usuario que salió.
export const apiRemoveWebPush = async (token: string): Promise<void> => {
  await apiAxios.delete(`/users/push-credentials/${encodeURIComponent(token)}`);
};
