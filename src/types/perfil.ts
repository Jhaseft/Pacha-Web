export interface MyProfileData {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  bio: string | null;
  email?: string | null;
  isOnline: boolean;
  likesCount: number;
  rateCredits?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface EarningsData {
  today: number;
  thisWeek: number;
  thisMonth: number;
  total: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  amount: number;
  service: string;
  createdAt: string;
}

export interface HistoryItem {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  priceCredits: number;
  createdAt: string;
  expiresAt: string;
}

export interface GalleryItem {
  id: string;
  imageUrl: string;
  description: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ServicePrice {
  id: string;
  serviceType: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}
