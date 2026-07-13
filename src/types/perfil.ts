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

// Campos según GET /anfitrionas/me/gallery. sortOrder/description no vienen
// del backend hoy; quedan opcionales por el código que aún los referencia.
export interface GalleryItem {
  id: string;
  imageUrl: string;
  isPremium: boolean;
  unlockCredits: number | null;
  isVisible: boolean;
  createdAt: string;
  sortOrder?: number;
  description?: string | null;
  updatedAt?: string;
}

// Estado del formulario de publicación (los créditos van como texto en el input).
export interface PublishGalleryForm {
  isPremium: boolean;
  unlockCredits: string;
}

export interface ServicePrice {
  id: string;
  serviceType: string;
  price: number;
  createdAt: string;
  updatedAt: string;
}
