import { apiFetch } from './api';

export interface CulqiChargeRequest {
  culqiToken: string;
  packageId: string;
  clientId: string;
}

export interface CulqiChargeResponse {
  message: string;
  credits: number;
  newBalance: string;
  chargeId: string;
}

export async function apiCulqiCharge(
  data: CulqiChargeRequest,
  token: string,
): Promise<CulqiChargeResponse> {
  return apiFetch<CulqiChargeResponse>(
    '/culqi/charge',
    { method: 'POST', body: JSON.stringify(data) },
    token,
  );
}

export async function apiCulqiChargeMe(
  data: { culqiToken: string; packageId: string },
  token: string,
): Promise<CulqiChargeResponse> {
  return apiFetch<CulqiChargeResponse>(
    '/culqi/charge/me',
    { method: 'POST', body: JSON.stringify(data) },
    token,
  );
}

export async function apiGetMyWallet(token: string): Promise<{ balance: number }> {
  return apiFetch<{ balance: number }>('/wallet/me/earnings', {}, token);
}
