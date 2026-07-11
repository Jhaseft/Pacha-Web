export interface EarningsData {
  today: number;
  thisWeek: number;
  total: number;
  balance: number;
  transactions: EarningTransaction[];
}

export interface EarningTransaction {
  id: string;
  service: string;
  amount: number;
  createdAt: string;
  clientName?: string;
}

export interface ChatData {
  id: string;
  unreadCount?: number;
}

export interface Bank {
  id: string;
  name: string;
}

export interface BankAccount {
  id: string;
  type: 'BCP' | 'OTHER_BANK' | 'PAYPAL' | 'BYBIT' | 'BINANCE';
  accountNumber?: string;
  paypalEmail?: string;
  bankName?: string;
  accountHolderName?: string;
}

export interface MyReferralsResponse {
  referralCode: string;
  totalReferrals: number;
  totalRewardAmount: number;
  referrals: ReferralContract[];
}

export interface ReferralContract {
  status: 'ACTIVE' | 'INACTIVE';
  percent: number;
}
