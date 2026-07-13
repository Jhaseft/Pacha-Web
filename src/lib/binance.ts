import { apiFetch } from './api';

export type BinanceIntentStatus = 'PENDING' | 'CONFIRMED' | 'REJECTED' | 'EXPIRED';

export interface BinanceNetworkOption {
  network: string;
  label: string;
  wallet: string;
}

export interface BinanceIntent {
  intentId: string;
  walletAddress: string;
  network: string;
  coin: string;
  amount: string;
  credits: number;
  packageName: string;
  expiresAt: string;
  status: BinanceIntentStatus;
  txid: string | null;
  failureReason: string | null;
  tolerancePercent: number;
  networks: BinanceNetworkOption[];
  defaultNetwork: string | null;
}

export interface BinanceConfirmResponse {
  status: 'CONFIRMED';
  credits: number;
  newBalance?: string;
  message: string;
}

export async function apiBinanceCreateIntent(
  packageId: string,
  token: string,
): Promise<BinanceIntent> {
  return apiFetch<BinanceIntent>(
    '/binance/intent',
    { method: 'POST', body: JSON.stringify({ packageId }) },
    token,
  );
}

export async function apiBinanceGetIntent(
  intentId: string,
  token: string,
): Promise<BinanceIntent> {
  return apiFetch<BinanceIntent>(`/binance/intent/${intentId}`, {}, token);
}

export async function apiBinanceConfirm(
  intentId: string,
  txid: string,
  token: string,
): Promise<BinanceConfirmResponse> {
  return apiFetch<BinanceConfirmResponse>(
    '/binance/confirm',
    { method: 'POST', body: JSON.stringify({ intentId, txid }) },
    token,
  );
}
