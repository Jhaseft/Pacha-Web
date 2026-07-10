import { apiAxios } from './apiClient';
import type { EarningsData, ChatData } from '../types/anfitriona';

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
