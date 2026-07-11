import { apiAxios, API_URL } from "./apiClient";

/** URL del servidor de sockets (mismo origen que la API). */
export const SOCKET_URL = API_URL;

export interface AgoraTokenResponse {
  token: string;
  appId: string;
}

/**
 * Genera un token Agora RTC para unirse a un canal.
 * POST /calls/token (requiere JWT). El token lo adjunta apiAxios.
 */
export async function getAgoraToken(
  channelName: string,
  uid: number,
): Promise<AgoraTokenResponse> {
  const res = await apiAxios.post<AgoraTokenResponse>("/calls/token", {
    channelName,
    uid,
  });
  return res.data;
}

/**
 * Deriva un uid numérico estable a partir del id de usuario (string).
 * Debe coincidir con el uid usado para pedir el token (el backend firma el
 * token para ese uid). Mismo algoritmo que la app móvil.
 */
export function uidFromUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = (Math.imul(31, hash) + userId.charCodeAt(i)) | 0;
  }
  return Math.abs(hash) % 100_000 || 1;
}
