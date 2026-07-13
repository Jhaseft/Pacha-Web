import { apiFetch } from './api';
import { DEFAULT_RATES, RatesMap } from './currency';

export interface PlatformConfig {
  creditToSolesRate: number;
  rates: RatesMap;
  minVersion?: string;
}

export async function apiGetConfig(): Promise<PlatformConfig> {
  try {
    const data = await apiFetch<Partial<PlatformConfig>>('/users/config');
    return {
      creditToSolesRate: data.creditToSolesRate ?? 1,
      rates: data.rates ?? DEFAULT_RATES,
      minVersion: data.minVersion,
    };
  } catch {
    return { creditToSolesRate: 1, rates: DEFAULT_RATES };
  }
}
