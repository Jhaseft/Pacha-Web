import { apiAxios } from './apiClient';

export interface GalleryImage {
  id: string;
  imageUrl: string;
  isPremium: boolean;
  isUnlockedByViewer: boolean;
  unlockCredits?: number | null;
}

export interface HighlightedStory {
  id: string;
  title: string;
  coverImage: string;
  stories: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
  }>;
}

export interface AnfitrioneProfileDetail {
  id: string;
  username: string;
  name: string;
  avatar: string | null;
  coverImage: string | null;
  introMessage: string | null;
  isOnline: boolean;
  likesCount: number;
  galleryImages: GalleryImage[];
  highlightedStories: HighlightedStory[];
}

export interface ServicePrice {
  serviceType: 'CALL' | 'VIDEO_CALL' | 'MESSAGE_SEND';
  price: number;
}

export interface SubscriptionPlan {
  id: string;
  price: number;
  durationDays: number;
}

export interface SubscriptionStatus {
  isSubscribed: boolean;
  expiresAt?: string;
}

export interface HistoryFeedItem {
  userId: string;
  name: string;
  avatar: string;
  stories: Array<{
    id: string;
    mediaUrl: string;
    mediaType: string;
  }>;
}

export async function getPublicHostessProfileByUsername(username: string): Promise<AnfitrioneProfileDetail> {
  const response = await apiAxios.get<AnfitrioneProfileDetail>(`/anfitrionas/public/username/${username}`);
  return response.data;
}

export async function getPublicHostessProfile(id: string): Promise<AnfitrioneProfileDetail> {
  const response = await apiAxios.get<AnfitrioneProfileDetail>(`/anfitrionas/public/${id}`);
  return response.data;
}

export async function getPublicServicePrices(profileId: string): Promise<ServicePrice[]> {
  try {
    const response = await apiAxios.get<ServicePrice[]>(`/service-prices/public/${profileId}`);
    return response.data;
  } catch {
    return [];
  }
}

export async function getStoriesFeed(): Promise<HistoryFeedItem[]> {
  try {
    const response = await apiAxios.get<HistoryFeedItem[]>('/histories/feed');
    return response.data;
  } catch {
    return [];
  }
}

export async function getPublicPlan(profileId: string): Promise<SubscriptionPlan> {
  try {
    const response = await apiAxios.get<SubscriptionPlan>(`/subscriptions/public/${profileId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export async function getSubscriptionStatus(profileId: string): Promise<SubscriptionStatus> {
  try {
    const response = await apiAxios.get<SubscriptionStatus>(`/subscriptions/public/${profileId}`);
    return response.data;
  } catch {
    return { isSubscribed: false };
  }
}

export async function buySubscription(profileId: string): Promise<{ expiresAt: string }> {
  const response = await apiAxios.post<{ expiresAt: string }>(`/user-subscriptions/buy/${profileId}`);
  return response.data;
}
