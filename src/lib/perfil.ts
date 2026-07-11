import { apiAxios } from './apiClient';
import { MyProfileData, EarningsData, HistoryItem, GalleryItem, ServicePrice } from '@/types/perfil';

export const apiGetMyProfile = async (): Promise<MyProfileData> => {
  const response = await apiAxios.get<MyProfileData>('/anfitrionas/me/profile');
  return response.data;
};

export const apiUpdateMyProfile = async (data: Partial<MyProfileData>): Promise<MyProfileData> => {
  const response = await apiAxios.patch<MyProfileData>('/anfitrionas/me/profile', data);
  return response.data;
};

export const apiGetMyEarnings = async (): Promise<EarningsData> => {
  const response = await apiAxios.get<EarningsData>('/wallet/me/earnings');
  return response.data;
};

export const apiGetMyStories = async (): Promise<HistoryItem[]> => {
  const response = await apiAxios.get<HistoryItem[]>('/anfitrionas/me/stories');
  return response.data;
};

export const apiCreateHistory = async (
  data: { priceCredits: number },
  file: { uri: string; type: string; name: string }
): Promise<HistoryItem> => {
  const formData = new FormData();
  formData.append('priceCredits', String(data.priceCredits));
  formData.append('file', file as any);

  const response = await apiAxios.post<HistoryItem>('/anfitrionas/history', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const apiDeleteHistory = async (id: string): Promise<void> => {
  await apiAxios.delete(`/anfitrionas/history/${id}`);
};

export const apiGetMyGallery = async (): Promise<GalleryItem[]> => {
  const response = await apiAxios.get<GalleryItem[]>('/anfitrionas/me/gallery');
  return response.data;
};

export const apiDeleteGalleryImage = async (id: string): Promise<void> => {
  await apiAxios.delete(`/anfitrionas/me/gallery/${id}`);
};

export const apiSetFeaturedGalleryImage = async (id: string): Promise<GalleryItem> => {
  const response = await apiAxios.post<GalleryItem>(`/anfitrionas/me/gallery/${id}/set-featured`);
  return response.data;
};

export const apiUploadGalleryImage = async (
  file: { uri: string; type: string; name: string },
  description?: string
): Promise<GalleryItem> => {
  const formData = new FormData();
  formData.append('file', file as any);
  if (description) formData.append('description', description);

  const response = await apiAxios.post<GalleryItem>('/anfitrionas/me/gallery', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const apiUpdateGalleryImage = async (
  id: string,
  data: { description?: string }
): Promise<GalleryItem> => {
  const response = await apiAxios.patch<GalleryItem>(`/anfitrionas/me/gallery/${id}`, data);
  return response.data;
};

export const apiGetMyServicePrices = async (): Promise<ServicePrice[]> => {
  const response = await apiAxios.get<ServicePrice[]>('/service-prices');
  return response.data;
};

export const apiUpsertServicePrice = async (
  serviceType: string,
  price: number
): Promise<ServicePrice> => {
  const response = await apiAxios.put<ServicePrice>('/service-prices', {
    serviceType,
    price,
  });
  return response.data;
};
