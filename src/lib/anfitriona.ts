import { apiAxios } from './apiClient';
import type {
  EarningsData,
  ChatData,
  Bank,
  BankAccount,
  MyReferralsResponse,
  MyWithdrawalRequest,
} from '../types/anfitriona';

export const apiGetMyEarnings = async (): Promise<EarningsData> => {
  const response = await apiAxios.get<EarningsData>('/wallet/me/earnings');
  return response.data;
};

export const getChats = async (userId: string): Promise<ChatData[]> => {
  const response = await apiAxios.get<ChatData[]>('/messages/chats', {
    params: { userId },
  });
  return response.data;
};

export const apiGetBanks = async (): Promise<Bank[]> => {
  const response = await apiAxios.get<Bank[]>('/wallet/banks');
  return response.data;
};

export const apiGetBankAccounts = async (): Promise<BankAccount[]> => {
  const response = await apiAxios.get<BankAccount[]>('/wallet/me/bank-accounts');
  return response.data;
};

export const apiAddBankAccount = async (data: {
  type: string;
  bankId?: string;
  accountNumber?: string;
  paypalEmail?: string;
  accountHolderName?: string;
}): Promise<BankAccount> => {
  const response = await apiAxios.post<BankAccount>('/wallet/me/bank-accounts', data);
  return response.data;
};

export const apiDeleteBankAccount = async (id: string): Promise<void> => {
  await apiAxios.delete(`/wallet/me/bank-accounts/${id}`);
};

export const apiCreateWithdrawalRequest = async (data: {
  credits: number;
  bankAccountId: string;
}): Promise<void> => {
  await apiAxios.post('/wallet/me/withdrawal-request', data);
};

// Solicitudes propias de la anfitriona. Ojo: no confundir con el
// apiGetWithdrawalRequests de lib/withdrawalRequest.ts, que es el del admin.
export const apiGetMyWithdrawalRequests = async (): Promise<MyWithdrawalRequest[]> => {
  const response = await apiAxios.get<MyWithdrawalRequest[]>('/wallet/me/withdrawal-requests');
  return response.data;
};

export const apiGetMyReferrals = async (): Promise<MyReferralsResponse> => {
  const response = await apiAxios.get<MyReferralsResponse>('/referrals/me');
  return response.data;
};
