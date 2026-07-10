export interface EarningsData {
  today: number;
  thisWeek: number;
  transactions: EarningTransaction[];
}

export interface EarningTransaction {
  id: string;
  service: string;
  amount: number;
  createdAt: string;
}

export interface ChatData {
  id: string;
  unreadCount?: number;
}
