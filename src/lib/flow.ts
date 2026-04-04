import { apiFetch } from './api';

export async function apiFlowCreatePayment(
  packageId: string,
  token: string,
): Promise<{ paymentUrl: string }> {
  return apiFetch<{ paymentUrl: string }>(
    '/flow/create',
    { method: 'POST', body: JSON.stringify({ packageId }) },
    token,
  );
}

export async function apiGetMyWallet(token: string): Promise<{ balance: number }> {
  return apiFetch<{ balance: number }>('/wallet/me/earnings', {}, token);
}
